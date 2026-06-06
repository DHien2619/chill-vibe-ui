import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import * as logic from "@/lib/room-logic";
import type { Player, RoomState } from "@/lib/room-logic";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const ROOM_KEY = `room:${logic.SHARED_CODE}`;
const REV_KEY = `${ROOM_KEY}:rev`;

const redis = Redis.fromEnv();

// Atomic compare-and-set on an integer revision so concurrent writers can NEVER
// clobber each other (last-write-wins was dropping joiners — see "tên biến mất" bug).
// KEYS[1]=room json key, KEYS[2]=rev key.
// ARGV[1]=expected rev (string), ARGV[2]=new room json ('' => delete), ARGV[3]=new rev.
// Returns 1 if we won the race (state written), 0 if someone else wrote first.
const CAS_SCRIPT = `
local curRev = redis.call('GET', KEYS[2])
if curRev == false then curRev = '0' end
if curRev ~= ARGV[1] then return 0 end
if ARGV[2] == '' then
  redis.call('DEL', KEYS[1])
  redis.call('DEL', KEYS[2])
else
  redis.call('SET', KEYS[1], ARGV[2])
  redis.call('SET', KEYS[2], ARGV[3])
end
return 1`;

type MutationResult =
  | { ok: true; room: RoomState | null; me?: Player }
  | { ok: false; error: string };

async function readState(): Promise<{ room: RoomState | null; rev: number }> {
  try {
    const vals = (await redis.mget(ROOM_KEY, REV_KEY)) as [
      RoomState | null,
      number | string | null
    ];
    const room = (vals?.[0] as RoomState) ?? null;
    const rawRev = vals?.[1];
    const rev = typeof rawRev === "number" ? rawRev : rawRev ? Number(rawRev) : 0;
    return { room, rev: Number.isFinite(rev) ? rev : 0 };
  } catch (err) {
    console.error("[api/room] readState failed", err);
    return { room: null, rev: 0 };
  }
}

// Read–modify–write with optimistic concurrency. `fn` is a PURE function of the
// current room; if it returns the same room reference (a no-op / permission denial)
// we skip the write entirely (so idle GET polls don't bump the rev and starve writers).
async function mutateRoom(
  fn: (room: RoomState | null) => MutationResult
): Promise<MutationResult> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const { room, rev } = await readState();
    const res = fn(room);
    if (!res.ok) return res;

    const next = res.room ?? null;
    if (next === room) return res; // unchanged → nothing to persist

    const del = next === null || next.players.length === 0;
    try {
      const won =
        Number(
          await redis.eval(
            CAS_SCRIPT,
            [ROOM_KEY, REV_KEY],
            [String(rev), del ? "" : JSON.stringify(next), String(rev + 1)]
          )
        ) === 1;
      if (won) return res;
      // CAS miss: a concurrent writer committed first. Jittered backoff de-syncs
      // racers (e.g. many people tapping "Vào phòng" together) so they don't lock-step.
      await new Promise((r) =>
        setTimeout(r, 8 * attempt + Math.floor(Math.random() * 20))
      );
    } catch (err) {
      // EVAL unavailable/failed → degrade to plain write (legacy last-write-wins)
      // so the app keeps working instead of 500ing. Loses atomicity only in this path.
      console.error("[api/room] CAS eval failed, fallback to plain write", err);
      if (del) {
        await redis.del(ROOM_KEY);
        await redis.del(REV_KEY);
      } else {
        await redis.set(ROOM_KEY, next);
        await redis.set(REV_KEY, rev + 1);
      }
      return res;
    }
  }
  return { ok: false, error: "Hệ thống bận, thử lại" };
}

export async function GET() {
  const res = await mutateRoom((room) => {
    if (!room) return { ok: true, room: null };
    const pruned = logic.pruneInactive(room);
    return { ok: true, room: pruned.players.length === 0 ? null : pruned };
  });
  return NextResponse.json({ room: res.ok ? res.room ?? null : null });
}

type Body = { action: string; payload?: Record<string, unknown> };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  const { action, payload = {} } = body;
  const notFound = { ok: false as const, error: "Không tìm thấy phòng" };

  switch (action) {
    case "JOIN": {
      const res = await mutateRoom((room) =>
        logic.joinSharedRoom(
          room,
          String(payload.name || ""),
          payload.avatar ? String(payload.avatar) : undefined
        )
      );
      return NextResponse.json(res);
    }
    case "LEAVE": {
      const res = await mutateRoom((room) =>
        room
          ? { ok: true, room: logic.leaveRoom(room, String(payload.playerId || "")) }
          : { ok: true, room: null }
      );
      return NextResponse.json(res);
    }
    case "HEARTBEAT": {
      const res = await mutateRoom((room) =>
        room
          ? { ok: true, room: logic.heartbeat(room, String(payload.playerId || "")) }
          : { ok: true, room: null }
      );
      return NextResponse.json(res);
    }
    case "ADD_BOT": {
      const res = await mutateRoom((room) =>
        room ? { ok: true, room: logic.addBot(room, String(payload.byHostId || "")) } : notFound
      );
      return NextResponse.json(res);
    }
    case "KICK_PLAYER": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.kickPlayer(
                room,
                String(payload.byHostId || ""),
                String(payload.targetId || "")
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "RENAME_BOT": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.renameBot(
                room,
                String(payload.byHostId || ""),
                String(payload.botId || ""),
                String(payload.newName || "")
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "REMOVE_ALL_BOTS": {
      const res = await mutateRoom((room) =>
        room
          ? { ok: true, room: logic.removeAllBots(room, String(payload.byHostId || "")) }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "UPDATE_CONFIG": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.updateConfig(
                room,
                String(payload.roleId || ""),
                Number(payload.delta || 0),
                String(payload.byHostId || "")
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "START_GAME": {
      const res = await mutateRoom((room) =>
        room ? logic.startGame(room, String(payload.byHostId || "")) : notFound
      );
      return NextResponse.json(res);
    }
    case "RESET_TO_LOBBY": {
      const res = await mutateRoom((room) =>
        room
          ? { ok: true, room: logic.resetToLobby(room, String(payload.byHostId || "")) }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "TRANSFER_HOST": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.transferHost(
                room,
                String(payload.fromId || ""),
                String(payload.toId || "")
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "ADD_NOTE": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.addNote(
                room,
                String(payload.text || ""),
                String(payload.byHostId || "")
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "DELETE_NOTE": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.deleteNote(
                room,
                String(payload.noteId || ""),
                String(payload.byHostId || "")
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "ADVANCE_PHASE": {
      const res = await mutateRoom((room) =>
        room
          ? { ok: true, room: logic.advancePhase(room, String(payload.byHostId || "")) }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "SET_PLAYER_DEAD": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.setPlayerDead(
                room,
                String(payload.byHostId || ""),
                String(payload.targetId || ""),
                Boolean(payload.dead)
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "SET_TRAPPED": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.setPlayerTrapped(
                room,
                String(payload.byHostId || ""),
                String(payload.targetId || ""),
                Boolean(payload.value)
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "SET_LOCKED": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.setPlayerLocked(
                room,
                String(payload.byHostId || ""),
                String(payload.targetId || ""),
                Boolean(payload.value)
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "SET_CUPID_PAIR": {
      const res = await mutateRoom((room) =>
        room
          ? {
              ok: true,
              room: logic.setCupidPair(
                room,
                String(payload.byHostId || ""),
                String(payload.targetId || "")
              ),
            }
          : notFound
      );
      return NextResponse.json(res);
    }
    case "RESET_ROOM": {
      // Unconditional nuke — no read-modify-write to protect, so skip CAS.
      try {
        await redis.del(ROOM_KEY);
        await redis.del(REV_KEY);
      } catch (err) {
        console.error("[api/room] RESET_ROOM del failed", err);
      }
      return NextResponse.json({ ok: true, room: null });
    }
    default:
      return NextResponse.json(
        { ok: false, error: `Unknown action: ${action}` },
        { status: 400 }
      );
  }
}
