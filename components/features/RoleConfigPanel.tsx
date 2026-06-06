"use client";

import {
  Moon,
  Eye,
  Shield,
  FlaskConical,
  Crosshair,
  Smile,
  User,
  Swords,
  Shuffle,
  Wand2,
  Droplets,
  Heart,
  MoonStar,
  Flower2,
  Minus,
  Plus,
  Lock,
  ChevronDown,
} from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { ROLE_TYPES, type RoleType, configCount } from "@/lib/roles";

const ICONS: Record<string, ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  Moon,
  Eye,
  Shield,
  FlaskConical,
  Crosshair,
  Smile,
  User,
  Swords,
  Shuffle,
  Wand2,
  Droplets,
  Heart,
  MoonStar,
  Cannabis: Flower2,
};

export function RoleConfigPanel({
  config,
  playerCount,
  canEdit,
  onChange,
}: {
  config: Record<string, number>;
  playerCount: number;
  canEdit: boolean;
  onChange: (roleId: string, delta: number) => void;
}) {
  const total = configCount(config);

  return (
    <div
      className="rounded-3xl p-4 md:p-5"
      style={{
        background: "linear-gradient(165deg, rgba(45,31,78,0.55), rgba(26,16,48,0.55))",
        border: "1px solid rgba(192,132,252,0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-white uppercase tracking-wider">Vai trò</h2>
          {!canEdit && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(192,132,252,0.12)", color: "#c084fc" }}
            >
              <Lock size={10} />
              Chỉ host
            </span>
          )}
        </div>
        <div
          className="text-xs font-bold px-2.5 py-1 rounded-lg"
          style={{
            background: "rgba(192,132,252,0.12)",
            color: "#c4b3e0",
            border: "1px solid rgba(192,132,252,0.25)",
          }}
          title={`${total} vai trò đã đặt cho ${playerCount} người chơi. Thiếu/thừa sẽ tự pad Dân hoặc cắt khi bắt đầu.`}
        >
          {total}/{playerCount}
        </div>
      </div>

      <p className="text-[10px] mb-2 px-1" style={{ color: "#9d7fd4" }}>
        Chạm vào vai trò để đọc mô tả đầy đủ
      </p>

      <div className="space-y-2">
        {ROLE_TYPES.map((role) => (
          <RoleRow
            key={role.id}
            role={role}
            count={config[role.id] || 0}
            canEdit={canEdit}
            onInc={() => onChange(role.id, 1)}
            onDec={() => onChange(role.id, -1)}
          />
        ))}
      </div>
    </div>
  );
}

function RoleRow({
  role,
  count,
  canEdit,
  onInc,
  onDec,
}: {
  role: RoleType;
  count: number;
  canEdit: boolean;
  onInc: () => void;
  onDec: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICONS[role.icon] ?? User;
  const inactive = count === 0;

  return (
    <div
      className="p-2 rounded-xl transition-all"
      style={{
        background: inactive ? "rgba(45,31,78,0.3)" : "rgba(45,31,78,0.6)",
        border: `1px solid ${inactive ? "rgba(192,132,252,0.08)" : `${role.color}40`}`,
        opacity: inactive ? 0.55 : 1,
      }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, ${role.color}, ${role.accent})`,
              boxShadow: inactive ? "none" : `0 0 12px ${role.color}40`,
            }}
          >
            <Icon size={20} color="#fff" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white truncate">{role.name}</span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider shrink-0"
                style={{
                  color:
                    role.team === "werewolf"
                      ? "#fca5a5"
                      : role.team === "neutral"
                      ? "#fcd34d"
                      : "#86efac",
                }}
              >
                {role.team === "werewolf" ? "Sói" : role.team === "neutral" ? "Trung lập" : "Dân làng"}
              </span>
              <ChevronDown
                size={13}
                className="shrink-0 transition-transform"
                style={{
                  color: "#9d7fd4",
                  transform: expanded ? "rotate(180deg)" : "none",
                }}
              />
            </div>
            <p
              className={`text-[10px] leading-snug mt-0.5 ${expanded ? "" : "line-clamp-1"}`}
              style={{ color: "#9d7fd4" }}
            >
              {role.blurb}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onDec}
            disabled={!canEdit || count === 0}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "rgba(192,132,252,0.12)",
              color: "#c084fc",
              border: "1px solid rgba(192,132,252,0.25)",
            }}
            aria-label="Giảm"
          >
            <Minus size={14} />
          </button>
          <span className="w-7 text-center text-sm font-black text-white">{count}</span>
          <button
            type="button"
            onClick={onInc}
            disabled={!canEdit || count >= role.max}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "rgba(249,115,22,0.15)",
              color: "#fdba74",
              border: "1px solid rgba(249,115,22,0.3)",
            }}
            aria-label="Tăng"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
