export type Team = "werewolf" | "villager" | "neutral";

export type RoleType = {
  id: string;
  name: string;
  team: Team;
  color: string;
  accent: string;
  icon: string;
  blurb: string;
  // Số lượng tối đa được phép pick cho role này
  max: number;
};

export const ROLE_TYPES: RoleType[] = [
  {
    id: "werewolf",
    name: "Sói",
    team: "werewolf",
    color: "#ef4444",
    accent: "#991b1b",
    icon: "Moon",
    blurb: "Mỗi đêm cùng cắn 1 người. Biết mặt đồng bọn.",
    max: 5,
  },
  {
    id: "seer",
    name: "Tiên tri",
    team: "villager",
    color: "#22d3ee",
    accent: "#0891b2",
    icon: "Eye",
    blurb: "Mỗi đêm soi 1 người để biết là Sói hay không.",
    max: 1,
  },
  {
    id: "bodyguard",
    name: "Bảo vệ",
    team: "villager",
    color: "#84cc16",
    accent: "#4d7c0f",
    icon: "Shield",
    blurb: "Mỗi đêm chọn 1 người để chắn đòn cắn của Sói.",
    max: 1,
  },
  {
    id: "witch",
    name: "Phù thủy",
    team: "villager",
    color: "#c084fc",
    accent: "#9333ea",
    icon: "FlaskConical",
    blurb: "1 bình cứu (cứu người bị cắn) và 1 bình giết (giết 1 người).",
    max: 1,
  },
  {
    id: "hunter",
    name: "Thợ săn",
    team: "villager",
    color: "#f97316",
    accent: "#c2410c",
    icon: "Crosshair",
    blurb: "Khi chết, kéo theo 1 người bất kỳ.",
    max: 1,
  },
  {
    id: "fool",
    name: "Thằng ngốc",
    team: "villager",
    color: "#fbbf24",
    accent: "#b45309",
    icon: "Smile",
    blurb: "Bị treo cổ vẫn không chết, nhưng mất quyền bỏ phiếu.",
    max: 1,
  },
  {
    id: "villager",
    name: "Dân",
    team: "villager",
    color: "#60a5fa",
    accent: "#1d4ed8",
    icon: "User",
    blurb: "Không có khả năng đặc biệt. Dùng tư duy để vạch mặt sói.",
    max: 12,
  },
];

export const ROLE_BY_ID: Record<string, RoleType> = Object.fromEntries(
  ROLE_TYPES.map((r) => [r.id, r])
);

export function getRoleById(id: string): RoleType | undefined {
  return ROLE_BY_ID[id];
}

// Default config theo số người chơi (không tính quản trò)
export function defaultConfig(playerCount: number): Record<string, number> {
  const cfg: Record<string, number> = {};
  let remaining = playerCount;

  const give = (id: string, n: number) => {
    if (remaining <= 0 || n <= 0) return;
    const take = Math.min(n, remaining);
    cfg[id] = (cfg[id] || 0) + take;
    remaining -= take;
  };

  if (playerCount >= 10) {
    give("werewolf", 3);
    give("seer", 1);
    give("bodyguard", 1);
    give("witch", 1);
    give("hunter", 1);
    give("fool", 1);
  } else if (playerCount >= 8) {
    give("werewolf", 2);
    give("seer", 1);
    give("bodyguard", 1);
    give("witch", 1);
    give("hunter", 1);
  } else if (playerCount >= 6) {
    give("werewolf", 2);
    give("seer", 1);
    give("bodyguard", 1);
    give("witch", 1);
  } else if (playerCount >= 4) {
    give("werewolf", 1);
    give("seer", 1);
    give("bodyguard", 1);
  } else if (playerCount >= 3) {
    give("werewolf", 1);
    give("seer", 1);
  }

  give("villager", remaining);
  return cfg;
}

export function configCount(cfg: Record<string, number>): number {
  let total = 0;
  for (const [id, n] of Object.entries(cfg)) {
    if (ROLE_BY_ID[id]) total += n;
  }
  return total;
}

export function expandConfigToList(cfg: Record<string, number>): string[] {
  const list: string[] = [];
  for (const [id, n] of Object.entries(cfg)) {
    if (!ROLE_BY_ID[id]) continue;
    for (let i = 0; i < n; i++) list.push(id);
  }
  return list;
}
