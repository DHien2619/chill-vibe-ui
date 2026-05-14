"use client";

import { useEffect, useState } from "react";
import {
  Moon,
  Eye,
  Shield,
  FlaskConical,
  Crosshair,
  Smile,
  User,
} from "lucide-react";
import type { ComponentType } from "react";
import {
  ROLE_BY_ID,
  ROLE_TYPES,
  expandConfigToList,
  type RoleType,
} from "@/lib/roles";

const ICONS: Record<string, ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  Moon,
  Eye,
  Shield,
  FlaskConical,
  Crosshair,
  Smile,
  User,
};

const TOTAL_STEPS = 20;
const START_DELAY_MS = 30;
const END_DELAY_MS = 200;
const HOLD_BEFORE_REVEAL_MS = 400;

export function RoleWheel({
  config,
  myRoleId,
  seed,
  onDone,
}: {
  config: Record<string, number>;
  myRoleId: string;
  seed: number;
  onDone: () => void;
}) {
  // Lock sequence on mount — parent re-renders must NOT rebuild it.
  const [sequence] = useState(() => buildSequence(config, myRoleId, seed, TOTAL_STEPS));

  const [phase, setPhase] = useState<"flashing" | "revealed">("flashing");
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      setStep(i);

      if (i >= sequence.length - 1) {
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setPhase("revealed");
          }, HOLD_BEFORE_REVEAL_MS)
        );
        return;
      }

      const t = i / (sequence.length - 1);
      const ease = Math.pow(t, 2.4);
      const delay = START_DELAY_MS + ease * (END_DELAY_MS - START_DELAY_MS);
      timers.push(
        window.setTimeout(() => {
          i++;
          tick();
        }, delay)
      );
    };

    tick();
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [sequence]);

  const currentRole = ROLE_BY_ID[sequence[step]] ?? ROLE_BY_ID[myRoleId];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-5 py-8"
      style={{
        background: "radial-gradient(circle at 50% 40%, rgba(45,31,78,0.96), rgba(14,8,24,0.98))",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-[400px] h-[400px] top-[-100px] left-[-80px] opacity-30"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)" }} />
        <div className="orb w-[340px] h-[340px] bottom-[-80px] right-[-60px] opacity-25"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 65%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <h2
          className="text-lg font-black uppercase tracking-[0.3em] mb-1 text-center"
          style={{ color: phase === "revealed" ? "#fbbf24" : "#c084fc" }}
        >
          {phase === "revealed" ? "Vai trò của bạn" : "Đang chia bài..."}
        </h2>
        <p className="text-xs mb-8 text-center" style={{ color: "#9d7fd4" }}>
          {phase === "revealed"
            ? "Đừng cho ai khác xem màn hình"
            : "Giữ điện thoại sát mặt mình"}
        </p>

        {phase === "flashing" && currentRole && (
          <FlashCard role={currentRole} stepKey={step} />
        )}

        {phase === "revealed" && (
          <RoleReveal role={ROLE_BY_ID[myRoleId]} onDone={onDone} />
        )}
      </div>
    </div>
  );
}

function FlashCard({ role, stepKey }: { role: RoleType; stepKey: number }) {
  const Icon = ICONS[role.icon] ?? User;
  return (
    <div
      key={stepKey}
      className="w-[240px] h-[280px] rounded-3xl flex flex-col items-center justify-center gap-4 ms-flash"
      style={{
        background: `linear-gradient(160deg, ${role.color}22, ${role.accent}15)`,
        border: `2px solid ${role.color}`,
        boxShadow: `0 0 32px ${role.color}55, 0 0 64px ${role.color}25`,
      }}
    >
      <div
        className="w-24 h-24 rounded-2xl flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${role.color}, ${role.accent})`,
          boxShadow: `0 0 28px ${role.color}80`,
        }}
      >
        <Icon size={52} color="#fff" strokeWidth={2.2} />
      </div>
      <div className="text-center">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{
            color:
              role.team === "werewolf"
                ? "#fca5a5"
                : role.team === "neutral"
                ? "#fcd34d"
                : "#86efac",
          }}
        >
          {role.team === "werewolf"
            ? "Phe Sói"
            : role.team === "neutral"
            ? "Trung lập"
            : "Dân làng"}
        </span>
        <h3 className="text-2xl font-black text-white mt-1">{role.name}</h3>
      </div>

    </div>
  );
}

function RoleReveal({ role, onDone }: { role: RoleType | undefined; onDone: () => void }) {
  if (!role) return null;
  const Icon = ICONS[role.icon] ?? User;

  return (
    <div
      className="w-full rounded-3xl p-5 flex flex-col items-center text-center ms-reveal"
      style={{
        background: `linear-gradient(160deg, ${role.color}28, ${role.accent}18)`,
        border: `2px solid ${role.color}`,
        boxShadow: `0 0 40px ${role.color}60, 0 0 80px ${role.color}30`,
      }}
    >
      <div
        className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3"
        style={{
          background: `linear-gradient(135deg, ${role.color}, ${role.accent})`,
          boxShadow: `0 0 32px ${role.color}90`,
        }}
      >
        <Icon size={52} color="#fff" strokeWidth={2.2} />
      </div>
      <span
        className="text-[10px] font-bold uppercase tracking-widest mb-1"
        style={{
          color:
            role.team === "werewolf"
              ? "#fca5a5"
              : role.team === "neutral"
              ? "#fcd34d"
              : "#86efac",
        }}
      >
        {role.team === "werewolf"
          ? "Phe Sói"
          : role.team === "neutral"
          ? "Trung lập"
          : "Phe Dân làng"}
      </span>
      <h3 className="text-3xl font-black text-white mb-2">{role.name}</h3>
      <p className="text-xs leading-relaxed mb-5 px-2" style={{ color: "#e9d5ff" }}>
        {role.blurb}
      </p>
      <button
        type="button"
        onClick={onDone}
        className="w-full h-12 rounded-xl text-sm font-black uppercase tracking-wider text-white"
        style={{
          background: "linear-gradient(135deg, #c084fc 0%, #f97316 100%)",
          boxShadow: "0 8px 24px rgba(192,132,252,0.4)",
        }}
      >
        Đã rõ
      </button>

    </div>
  );
}

function buildSequence(
  config: Record<string, number>,
  myRoleId: string,
  seed: number,
  steps: number
): string[] {
  const rand = mulberry32(seed);
  const pool: string[] = [];
  for (const id of Object.keys(config)) {
    if ((config[id] || 0) > 0) pool.push(id);
  }
  if (pool.length === 0) ROLE_TYPES.forEach((r) => pool.push(r.id));

  const seq: string[] = [];
  let prev = "";
  for (let i = 0; i < steps - 1; i++) {
    let pick = pool[Math.floor(rand() * pool.length)];
    if (pick === prev && pool.length > 1) {
      // avoid same-frame repeats so the flash always feels animated
      pick = pool[(pool.indexOf(pick) + 1) % pool.length];
    }
    seq.push(pick);
    prev = pick;
  }
  seq.push(myRoleId);
  return seq;
}

function mulberry32(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
