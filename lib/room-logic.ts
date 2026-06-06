import { configCount, defaultConfig, expandConfigToList } from "./roles";

export type Player = {
  id: string;
  name: string;
  joinedAt: number;
  isHost: boolean;
  isBot?: boolean;
  lastSeen?: number;
  isDead?: boolean;
  avatar?: string;
  isTrapped?: boolean;
  isLocked?: boolean;
};

export const AVATARS: string[] = [
  "/avatars/av1.jpg",
  "/avatars/av2.jpg",
  "/avatars/av3.jpg",
  "/avatars/av4.jpg",
  "/avatars/av5.jpg",
  "/avatars/av6.jpg",
  "/avatars/av7.jpg",
  "/avatars/av8.jpg",
  "/avatars/av9.jpg",
  "/avatars/av10.jpg",
  "/avatars/av11.jpg",
  "/avatars/av12.jpg",
  "/avatars/av13.jpg",
];

function pickAvatar(usedAvatars: Set<string>): string {
  const available = AVATARS.filter((a) => !usedAvatars.has(a));
  const pool = available.length > 0 ? available : AVATARS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export type RoomStatus = "lobby" | "revealing" | "playing" | "ended";
export type Phase = "night" | "day";

export type Note = {
  id: string;
  text: string;
  at: number;
  round: number;
  phase: Phase;
};

export type RoomState = {
  code: string;
  hostId: string;
  createdAt: number;
  players: Player[];
  maxPlayers: number;
  status: RoomStatus;
  config: Record<string, number>;
  assignments?: Record<string, string>;
  revealSeed?: number;
  notes?: Note[];
  currentRound?: number;
  currentPhase?: Phase;
  cupidPair?: string[];
};

export const MAX_PLAYERS = 16;
export const SHARED_CODE = "MAIN";
const STALE_AFTER_MS = 600_000; // 10 phút — cho phép tắt màn hình lâu hơn

const BOT_NAMES = [
  "Linh", "Nam", "An", "Khoa", "My", "Bao",
  "Lan", "Tu", "Quan", "Hoa", "Dung", "Hung",
  "Phuc", "Trang", "Minh", "Hue",
];

export function phaseLabel(phase: Phase, round: number): string {
  return `${phase === "night" ? "Đêm" : "Ngày"} ${round}`;
}

export function generatePlayerId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isInactivePlayer(p: Player, now: number): boolean {
  if (p.isBot) return false;
  const last = p.lastSeen ?? p.joinedAt;
  return now - last > STALE_AFTER_MS;
}

export function pruneInactive(room: RoomState): RoomState {
  const now = Date.now();
  const active = room.players.filter((p) => !isInactivePlayer(p, now));
  if (active.length === room.players.length) return room;

  const humans = active.filter((p) => !p.isBot);
  if (humans.length === 0) {
    // Không còn ai thật trong phòng → coi như phòng tan, kéo theo bot
    return { ...room, players: [] };
  }

  let hostId = room.hostId;
  if (!active.find((p) => p.id === hostId)) {
    const newHost = humans[0];
    hostId = newHost.id;
    active.forEach((p) => {
      p.isHost = p.id === newHost.id;
    });
  }
  return { ...room, players: active, hostId };
}

// --- Pure action handlers: take RoomState (or null), return new RoomState (or { error }) ---

export type JoinResult =
  | { ok: true; room: RoomState; me: Player }
  | { ok: false; error: string };

export function joinSharedRoom(room: RoomState | null, name: string, preferredAvatar?: string): JoinResult {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Vui lòng nhập tên" };
  if (trimmed.length > 16) return { ok: false, error: "Tên tối đa 16 ký tự" };

  let active = room;
  if (active) {
    const pruned = pruneInactive(active);
    active = pruned.players.length === 0 ? null : pruned;
  }

  const now = Date.now();

  if (!active) {
    const host: Player = {
      id: generatePlayerId(),
      name: trimmed,
      joinedAt: now,
      lastSeen: now,
      isHost: true,
      avatar: preferredAvatar || pickAvatar(new Set()),
    };
    const newRoom: RoomState = {
      code: SHARED_CODE,
      hostId: host.id,
      createdAt: now,
      players: [host],
      maxPlayers: MAX_PLAYERS,
      status: "lobby",
      config: defaultConfig(0),
    };
    return { ok: true, room: newRoom, me: host };
  }

  if (active.players.length >= active.maxPlayers) {
    return { ok: false, error: "Phòng đã đầy" };
  }
  if (active.status !== "lobby") {
    return { ok: false, error: "Ván đang diễn ra, vui lòng chờ ván sau" };
  }
  const dup = active.players.find(
    (p) => p.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (dup) return { ok: false, error: "Tên này đã có người dùng" };

  const used = new Set(
    active.players.map((p) => p.avatar).filter(Boolean) as string[]
  );
  const chosenAvatar = preferredAvatar && !used.has(preferredAvatar)
    ? preferredAvatar
    : pickAvatar(used);
  const me: Player = {
    id: generatePlayerId(),
    name: trimmed,
    joinedAt: now,
    lastSeen: now,
    isHost: false,
    avatar: chosenAvatar,
  };
  const players = [...active.players, me];
  return {
    ok: true,
    room: {
      ...active,
      players,
      config: defaultConfig(Math.max(0, players.length - 1)),
    },
    me,
  };
}

export function leaveRoom(room: RoomState, playerId: string): RoomState | null {
  const wasHost = room.hostId === playerId;
  const remaining = room.players.filter((p) => p.id !== playerId);
  const humans = remaining.filter((p) => !p.isBot);

  if (humans.length === 0) return null;

  let players = remaining;
  let hostId = room.hostId;
  if (wasHost) {
    const newHost = humans[0];
    hostId = newHost.id;
    players = remaining.map((p) => ({ ...p, isHost: p.id === newHost.id }));
  }
  return {
    ...room,
    players,
    hostId,
    config: defaultConfig(Math.max(0, players.length - 1)),
  };
}

export function kickPlayer(
  room: RoomState,
  byHostId: string,
  targetId: string
): RoomState {
  if (room.hostId !== byHostId) return room;
  if (targetId === byHostId) return room; // không tự kick mình
  const remaining = room.players.filter((p) => p.id !== targetId);
  if (remaining.length === room.players.length) return room;
  return {
    ...room,
    players: remaining,
    config: defaultConfig(Math.max(0, remaining.length - 1)),
  };
}

export function heartbeat(room: RoomState, playerId: string): RoomState {
  const idx = room.players.findIndex((p) => p.id === playerId);
  if (idx < 0) return room;
  return {
    ...room,
    players: room.players.map((p, i) =>
      i === idx ? { ...p, lastSeen: Date.now() } : p
    ),
  };
}

export function addBot(room: RoomState, byHostId: string): RoomState {
  if (room.hostId !== byHostId) return room;
  if (room.status !== "lobby") return room;
  if (room.players.length >= room.maxPlayers) return room;

  const used = new Set(room.players.map((p) => p.name.toLowerCase()));
  const candidates = BOT_NAMES.filter((n) => !used.has(n.toLowerCase()));
  const pick =
    candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : `Bot ${room.players.length + 1}`;

  const usedAvatars = new Set(
    room.players.map((p) => p.avatar).filter(Boolean) as string[]
  );
  const bot: Player = {
    id: generatePlayerId(),
    name: pick,
    joinedAt: Date.now(),
    isHost: false,
    isBot: true,
    avatar: pickAvatar(usedAvatars),
  };
  const players = [...room.players, bot];
  return {
    ...room,
    players,
    config: defaultConfig(Math.max(0, players.length - 1)),
  };
}

export function renameBot(
  room: RoomState,
  byHostId: string,
  botId: string,
  newName: string
): RoomState {
  if (room.hostId !== byHostId) return room;
  const trimmed = newName.trim();
  if (!trimmed || trimmed.length > 16) return room;
  const target = room.players.find((p) => p.id === botId);
  if (!target || !target.isBot) return room;
  const dup = room.players.find(
    (p) => p.id !== botId && p.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (dup) return room;
  return {
    ...room,
    players: room.players.map((p) =>
      p.id === botId ? { ...p, name: trimmed } : p
    ),
  };
}

export function removeAllBots(room: RoomState, byHostId: string): RoomState {
  if (room.hostId !== byHostId) return room;
  if (room.status !== "lobby") return room;
  const players = room.players.filter((p) => !p.isBot);
  if (players.length === room.players.length) return room;
  return {
    ...room,
    players,
    config: defaultConfig(Math.max(0, players.length - 1)),
  };
}

export function updateConfig(
  room: RoomState,
  roleId: string,
  delta: number,
  byHostId: string
): RoomState {
  if (room.hostId !== byHostId) return room;
  if (room.status !== "lobby") return room;
  const next = Math.max(0, (room.config[roleId] || 0) + delta);
  return { ...room, config: { ...room.config, [roleId]: next } };
}

export type StartResult =
  | { ok: true; room: RoomState }
  | { ok: false; error: string };

export function startGame(room: RoomState, byHostId: string): StartResult {
  if (room.hostId !== byHostId) return { ok: false, error: "Chỉ quản trò được bắt đầu" };
  if (room.status !== "lobby") return { ok: false, error: "Ván đã bắt đầu" };

  const playersForRoles = room.players.filter((p) => p.id !== room.hostId);
  if (playersForRoles.length < 3) {
    return { ok: false, error: "Cần ít nhất 3 người chơi (chưa tính quản trò)" };
  }

  const roleList = expandConfigToList(room.config);
  // Pad villager nếu thiếu role, cắt bớt nếu thừa — quản trò không cần cân chính xác
  while (roleList.length < playersForRoles.length) {
    roleList.push("villager");
  }
  if (roleList.length > playersForRoles.length) {
    roleList.length = playersForRoles.length;
  }
  for (let i = roleList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roleList[i], roleList[j]] = [roleList[j], roleList[i]];
  }
  const assignments: Record<string, string> = {};
  playersForRoles.forEach((p, i) => {
    assignments[p.id] = roleList[i];
  });

  return {
    ok: true,
    room: {
      ...room,
      assignments,
      status: "revealing",
      revealSeed: Date.now(),
      currentRound: 1,
      currentPhase: "night",
      notes: [],
      players: room.players.map((p) => ({ ...p, isDead: false, isTrapped: false, isLocked: false })),
    },
  };
}

export function resetToLobby(room: RoomState, byHostId: string): RoomState {
  if (room.hostId !== byHostId) return room;
  const next: RoomState = {
    ...room,
    status: "lobby",
    players: room.players.map((p) => ({ ...p, isDead: false, isTrapped: false, isLocked: false })),
  };
  delete next.assignments;
  delete next.revealSeed;
  delete next.notes;
  delete next.currentRound;
  delete next.currentPhase;
  delete next.cupidPair;
  return next;
}

export function transferHost(
  room: RoomState,
  fromId: string,
  toId: string
): RoomState {
  if (room.hostId !== fromId) return room;
  const target = room.players.find((p) => p.id === toId);
  if (!target || target.isBot) return room;
  return {
    ...room,
    players: room.players.map((p) => ({ ...p, isHost: p.id === toId })),
    hostId: toId,
  };
}

export function addNote(
  room: RoomState,
  text: string,
  byHostId: string
): RoomState {
  if (room.hostId !== byHostId) return room;
  const clean = text.trim();
  if (!clean) return room;
  const note: Note = {
    id: `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    text: clean.slice(0, 200),
    at: Date.now(),
    round: room.currentRound || 1,
    phase: room.currentPhase || "night",
  };
  return { ...room, notes: [...(room.notes || []), note] };
}

export function deleteNote(
  room: RoomState,
  noteId: string,
  byHostId: string
): RoomState {
  if (room.hostId !== byHostId) return room;
  return { ...room, notes: (room.notes || []).filter((n) => n.id !== noteId) };
}

export function advancePhase(room: RoomState, byHostId: string): RoomState {
  if (room.hostId !== byHostId) return room;
  if (room.status !== "revealing") return room;
  const phase = room.currentPhase || "night";
  const round = room.currentRound || 1;
  if (phase === "night") {
    return { ...room, currentPhase: "day", currentRound: round };
  }
  let next: RoomState = { ...room, currentPhase: "night", currentRound: round + 1 };

  // Đêm 3: Kẻ phê cần thức tỉnh — random role từ các role đang có trong ván
  if (round + 1 === 3 && next.assignments) {
    const stonerEntries = Object.entries(next.assignments).filter(
      ([, role]) => role === "stoner"
    );
    if (stonerEntries.length > 0) {
      // Lấy danh sách role gốc đang có trong ván (trừ stoner, villager)
      const rolesInGame = new Set(Object.values(next.assignments));
      rolesInGame.delete("stoner");
      rolesInGame.delete("villager");
      const pool = Array.from(rolesInGame);
      if (pool.length > 0) {
        const newAssignments = { ...next.assignments };
        for (const [pid] of stonerEntries) {
          newAssignments[pid] = pool[Math.floor(Math.random() * pool.length)];
        }
        next = { ...next, assignments: newAssignments };
      }
    }
  }

  return next;
}

export function setPlayerDead(
  room: RoomState,
  byHostId: string,
  targetId: string,
  dead: boolean
): RoomState {
  if (room.hostId !== byHostId) return room;
  const idx = room.players.findIndex((p) => p.id === targetId);
  if (idx < 0) return room;
  let updated = {
    ...room,
    players: room.players.map((p) =>
      p.id === targetId ? { ...p, isDead: dead } : p
    ),
  };
  if (dead && updated.cupidPair?.length === 2) {
    const [a, b] = updated.cupidPair;
    if (targetId === a || targetId === b) {
      const partnerId = targetId === a ? b : a;
      const partner = updated.players.find((p) => p.id === partnerId);
      if (partner && !partner.isDead) {
        updated = {
          ...updated,
          players: updated.players.map((p) =>
            p.id === partnerId ? { ...p, isDead: true } : p
          ),
        };
      }
    }
  }
  return updated;
}

export function setPlayerTrapped(
  room: RoomState,
  byHostId: string,
  targetId: string,
  trapped: boolean
): RoomState {
  if (room.hostId !== byHostId) return room;
  if (room.players.findIndex((p) => p.id === targetId) < 0) return room;
  return {
    ...room,
    players: room.players.map((p) =>
      p.id === targetId ? { ...p, isTrapped: trapped } : p
    ),
  };
}

export function setPlayerLocked(
  room: RoomState,
  byHostId: string,
  targetId: string,
  locked: boolean
): RoomState {
  if (room.hostId !== byHostId) return room;
  if (room.players.findIndex((p) => p.id === targetId) < 0) return room;
  return {
    ...room,
    players: room.players.map((p) =>
      p.id === targetId ? { ...p, isLocked: locked } : p
    ),
  };
}

export function setCupidPair(
  room: RoomState,
  byHostId: string,
  targetId: string
): RoomState {
  if (room.hostId !== byHostId) return room;
  if (!room.players.find((p) => p.id === targetId)) return room;
  const pair = room.cupidPair || [];
  if (pair.includes(targetId)) {
    const next = pair.filter((id) => id !== targetId);
    return { ...room, cupidPair: next.length > 0 ? next : undefined };
  }
  if (pair.length >= 2) {
    return { ...room, cupidPair: [targetId] };
  }
  return { ...room, cupidPair: [...pair, targetId] };
}
