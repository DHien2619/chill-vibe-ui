import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import * as logic from "@/lib/room-logic";
import type { RoomState } from "@/lib/room-logic";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const ROOM_KEY = `room:${logic.SHARED_CODE}`;

const redis = Redis.fromEnv();

async function loadRoom(): Promise<RoomState | null> {
  try {
    const data = await redis.get<RoomState>(ROOM_KEY);
    return data ?? null;
  } catch (err) {
    console.error("[api/room] redis.get failed", err);
    return null;
  }
}

async function saveRoom(room: RoomState | null): Promise<void> {
  if (room === null || room.players.length === 0) {
    await redis.del(ROOM_KEY);
    return;
  }
  await redis.set(ROOM_KEY, room);
}

export async function GET() {
  const room = await loadRoom();
  if (!room) return NextResponse.json({ room: null });

  const pruned = logic.pruneInactive(room);
  if (pruned !== room) {
    const finalRoom = pruned.players.length === 0 ? null : pruned;
    await saveRoom(finalRoom);
    return NextResponse.json({ room: finalRoom });
  }
  return NextResponse.json({ room });
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
  const room = await loadRoom();

  switch (action) {
    case "JOIN": {
      const res = logic.joinSharedRoom(room, String(payload.name || ""));
      if (!res.ok) return NextResponse.json(res);
      await saveRoom(res.room);
      return NextResponse.json({ ok: true, room: res.room, me: res.me });
    }
    case "LEAVE": {
      if (!room) return NextResponse.json({ ok: true, room: null });
      const next = logic.leaveRoom(room, String(payload.playerId || ""));
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "HEARTBEAT": {
      if (!room) return NextResponse.json({ ok: true, room: null });
      const next = logic.heartbeat(room, String(payload.playerId || ""));
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "ADD_BOT": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.addBot(room, String(payload.byHostId || ""));
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "REMOVE_ALL_BOTS": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.removeAllBots(room, String(payload.byHostId || ""));
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "UPDATE_CONFIG": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.updateConfig(
        room,
        String(payload.roleId || ""),
        Number(payload.delta || 0),
        String(payload.byHostId || "")
      );
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "START_GAME": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const res = logic.startGame(room, String(payload.byHostId || ""));
      if (!res.ok) return NextResponse.json(res);
      await saveRoom(res.room);
      return NextResponse.json({ ok: true, room: res.room });
    }
    case "RESET_TO_LOBBY": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.resetToLobby(room, String(payload.byHostId || ""));
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "TRANSFER_HOST": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.transferHost(
        room,
        String(payload.fromId || ""),
        String(payload.toId || "")
      );
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "ADD_NOTE": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.addNote(
        room,
        String(payload.text || ""),
        String(payload.byHostId || "")
      );
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "DELETE_NOTE": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.deleteNote(
        room,
        String(payload.noteId || ""),
        String(payload.byHostId || "")
      );
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "ADVANCE_PHASE": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.advancePhase(room, String(payload.byHostId || ""));
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "SET_PLAYER_DEAD": {
      if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng" });
      const next = logic.setPlayerDead(
        room,
        String(payload.byHostId || ""),
        String(payload.targetId || ""),
        Boolean(payload.dead)
      );
      await saveRoom(next);
      return NextResponse.json({ ok: true, room: next });
    }
    case "RESET_ROOM": {
      await saveRoom(null);
      return NextResponse.json({ ok: true, room: null });
    }
    default:
      return NextResponse.json(
        { ok: false, error: `Unknown action: ${action}` },
        { status: 400 }
      );
  }
}
