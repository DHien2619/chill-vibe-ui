"use client";

import type {
  Player,
  RoomState,
  RoomStatus,
  Phase,
  Note,
  JoinResult,
  StartResult,
} from "./room-logic";

export type {
  Player,
  RoomState,
  RoomStatus,
  Phase,
  Note,
  JoinResult,
  StartResult,
};

export { MAX_PLAYERS, SHARED_CODE, phaseLabel } from "./room-logic";

const ME_KEY = "ms-me";
const ROOM_CACHE_KEY = "ms-room-cache";
const POLL_INTERVAL_MS = 5000;
const API_URL = "/api/room";

type ActionResult =
  | { ok: true; room: RoomState | null; me?: Player }
  | { ok: false; error: string };

async function postAction(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<ActionResult> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
      cache: "no-store",
    });
    return (await res.json()) as ActionResult;
  } catch (e) {
    return { ok: false, error: (e as Error)?.message || "Mất kết nối" };
  }
}

export async function fetchRoom(): Promise<RoomState | null> {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = (await res.json()) as { room: RoomState | null };
    return data.room;
  } catch {
    return null;
  }
}

export async function joinSharedRoom(name: string, avatar?: string): Promise<JoinResult> {
  const res = await postAction("JOIN", { name, avatar });
  if (!res.ok) return res;
  if (res.me && res.room) {
    saveMe(res.me);
    cacheRoom(res.room);
    return { ok: true, room: res.room, me: res.me };
  }
  return { ok: false, error: "Lỗi không xác định" };
}

export async function leaveRoom(playerId: string): Promise<void> {
  await postAction("LEAVE", { playerId });
}

export async function heartbeat(playerId: string): Promise<void> {
  await postAction("HEARTBEAT", { playerId });
}

export async function addBot(byHostId: string): Promise<RoomState | null> {
  const res = await postAction("ADD_BOT", { byHostId });
  return res.ok ? res.room : null;
}

export async function removeAllBots(byHostId: string): Promise<RoomState | null> {
  const res = await postAction("REMOVE_ALL_BOTS", { byHostId });
  return res.ok ? res.room : null;
}

export async function kickPlayer(byHostId: string, targetId: string): Promise<RoomState | null> {
  const res = await postAction("KICK_PLAYER", { byHostId, targetId });
  return res.ok ? res.room : null;
}

export async function renameBot(
  byHostId: string,
  botId: string,
  newName: string
): Promise<RoomState | null> {
  const res = await postAction("RENAME_BOT", { byHostId, botId, newName });
  return res.ok ? res.room : null;
}

export async function updateConfig(
  roleId: string,
  delta: number,
  byHostId: string
): Promise<RoomState | null> {
  const res = await postAction("UPDATE_CONFIG", { roleId, delta, byHostId });
  return res.ok ? res.room : null;
}

export async function startGame(
  byHostId: string
): Promise<{ ok: true; room: RoomState } | { ok: false; error: string }> {
  const res = await postAction("START_GAME", { byHostId });
  if (!res.ok) return res;
  if (!res.room) return { ok: false, error: "Phòng trống" };
  return { ok: true, room: res.room };
}

export async function resetToLobby(byHostId: string): Promise<RoomState | null> {
  const res = await postAction("RESET_TO_LOBBY", { byHostId });
  return res.ok ? res.room : null;
}

export async function transferHost(
  fromId: string,
  toId: string
): Promise<RoomState | null> {
  const res = await postAction("TRANSFER_HOST", { fromId, toId });
  return res.ok ? res.room : null;
}

export async function addNote(
  text: string,
  byHostId: string
): Promise<RoomState | null> {
  const res = await postAction("ADD_NOTE", { text, byHostId });
  return res.ok ? res.room : null;
}

export async function deleteNote(
  noteId: string,
  byHostId: string
): Promise<RoomState | null> {
  const res = await postAction("DELETE_NOTE", { noteId, byHostId });
  return res.ok ? res.room : null;
}

export async function advancePhase(byHostId: string): Promise<RoomState | null> {
  const res = await postAction("ADVANCE_PHASE", { byHostId });
  return res.ok ? res.room : null;
}

export async function setPlayerDead(
  byHostId: string,
  targetId: string,
  dead: boolean
): Promise<RoomState | null> {
  const res = await postAction("SET_PLAYER_DEAD", { byHostId, targetId, dead });
  return res.ok ? res.room : null;
}

export async function setPlayerTrapped(
  byHostId: string,
  targetId: string,
  value: boolean
): Promise<RoomState | null> {
  const res = await postAction("SET_TRAPPED", { byHostId, targetId, value });
  return res.ok ? res.room : null;
}

export async function setPlayerLocked(
  byHostId: string,
  targetId: string,
  value: boolean
): Promise<RoomState | null> {
  const res = await postAction("SET_LOCKED", { byHostId, targetId, value });
  return res.ok ? res.room : null;
}

export async function setCupidPair(
  byHostId: string,
  targetId: string
): Promise<RoomState | null> {
  const res = await postAction("SET_CUPID_PAIR", { byHostId, targetId });
  return res.ok ? res.room : null;
}

export async function resetRoom(): Promise<void> {
  await postAction("RESET_ROOM");
}

// --- Me persistence (client only) ---

export function saveMe(player: Player): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    ME_KEY,
    JSON.stringify({ player, code: "MAIN" })
  );
}

export function loadMe(): { player: Player; code: string } | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(ME_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearMe(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ME_KEY);
}

function cacheRoom(room: RoomState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ROOM_CACHE_KEY, JSON.stringify(room));
}

export function loadCachedRoom(): RoomState | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(ROOM_CACHE_KEY);
  if (!raw) return null;
  window.sessionStorage.removeItem(ROOM_CACHE_KEY);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// --- Subscribe via polling (visibility-aware) ---

export function subscribeRoom(
  onChange: (room: RoomState | null) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  let cancelled = false;
  let lastJson = "";
  let timer: number | null = null;

  const tick = async () => {
    if (cancelled || document.visibilityState === "hidden") return;
    const room = await fetchRoom();
    if (cancelled) return;
    const json = JSON.stringify(room);
    if (json !== lastJson) {
      lastJson = json;
      onChange(room);
    }
  };

  const schedule = () => {
    if (timer != null) window.clearInterval(timer);
    timer = window.setInterval(tick, POLL_INTERVAL_MS);
  };

  const handleVisibility = () => {
    if (document.visibilityState === "visible") {
      tick();
      schedule();
    } else if (timer != null) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  // initial fetch + start polling
  tick();
  schedule();
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    cancelled = true;
    if (timer != null) window.clearInterval(timer);
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}
