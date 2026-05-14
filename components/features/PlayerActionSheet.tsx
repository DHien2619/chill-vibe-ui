"use client";

import { Crown, X, Heart } from "lucide-react";
import type { Player } from "@/lib/room-store";

export type QuickAction = {
  label: string;
  template: string;
  color: string;
  effect?: "kill" | "revive";
};

export const HOST_QUICK_ACTIONS: QuickAction[] = [
  { label: "Treo cổ", template: "bị treo cổ", color: "#ef4444", effect: "kill" },
  { label: "Sói cắn", template: "bị Sói cắn", color: "#dc2626", effect: "kill" },
  { label: "Tiên tri soi", template: "bị Tiên tri soi", color: "#22d3ee" },
  { label: "Bảo vệ", template: "được Bảo vệ chọn", color: "#84cc16" },
  { label: "Phù thủy cứu", template: "được Phù thủy cứu", color: "#c084fc", effect: "revive" },
  { label: "Phù thủy giết", template: "bị Phù thủy giết", color: "#9333ea", effect: "kill" },
  { label: "Thợ săn bắn", template: "bị Thợ săn bắn theo", color: "#f59e0b", effect: "kill" },
];

export function PlayerActionSheet({
  target,
  targetRole,
  canTransferHost,
  onTransferHost,
  quickActions,
  onQuickAction,
  onRevive,
  onClose,
}: {
  target: Player;
  targetRole?: { name: string; color: string };
  canTransferHost: boolean;
  onTransferHost: () => void;
  quickActions?: QuickAction[];
  onQuickAction?: (action: QuickAction) => void;
  onRevive?: () => void;
  onClose: () => void;
}) {
  const isDead = !!target.isDead;
  const hasQuickActions = quickActions && quickActions.length > 0 && onQuickAction;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      style={{ background: "rgba(14,8,24,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-5 ms-sheet"
        style={{
          background: "linear-gradient(165deg, #2d1f4e, #1a1030)",
          border: "1px solid rgba(192,132,252,0.25)",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.6), 0 0 40px rgba(192,132,252,0.15)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-black text-white truncate">{target.name}</h3>
              {targetRole && (
                <span
                  className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                  style={{
                    background: `${targetRole.color}25`,
                    color: targetRole.color,
                    border: `1px solid ${targetRole.color}55`,
                  }}
                >
                  {targetRole.name}
                </span>
              )}
            </div>
            <p className="text-[11px] uppercase tracking-wider mt-0.5" style={{ color: isDead ? "#fca5a5" : "#9d7fd4" }}>
              {isDead
                ? "Đã chết"
                : target.isBot
                ? "Bot"
                : target.isHost
                ? "Quản trò hiện tại"
                : "Người chơi"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "rgba(192,132,252,0.12)",
              color: "#c4b3e0",
              border: "1px solid rgba(192,132,252,0.2)",
            }}
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        {hasQuickActions && !isDead && (
          <div className="mb-3">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "#9d7fd4" }}
            >
              Ghi nhanh
            </p>
            <div className="grid grid-cols-3 gap-2">
              {quickActions!.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => onQuickAction!(action)}
                  className="h-14 rounded-xl px-1 text-[11px] font-black uppercase tracking-wider active:scale-95 transition-transform"
                  style={{
                    background: `${action.color}18`,
                    color: action.color,
                    border: `1.5px solid ${action.color}55`,
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isDead && onRevive && (
          <button
            type="button"
            onClick={onRevive}
            className="w-full h-12 mb-2 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider text-white"
            style={{
              background: "linear-gradient(135deg, #22c55e, #84cc16)",
              boxShadow: "0 8px 24px rgba(34,197,94,0.35)",
            }}
          >
            <Heart size={16} />
            Hồi sinh
          </button>
        )}

        {canTransferHost ? (
          <button
            type="button"
            onClick={onTransferHost}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider text-white"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f97316)",
              boxShadow: "0 8px 24px rgba(251,191,36,0.35)",
            }}
          >
            <Crown size={16} />
            Làm quản trò
          </button>
        ) : !hasQuickActions ? (
          <p className="text-xs text-center py-3" style={{ color: "#9d7fd4" }}>
            {target.isBot
              ? "Không thể giao quản trò cho bot"
              : target.isHost
              ? "Đây là quản trò hiện tại"
              : "Chỉ quản trò mới có thể chuyển quyền"}
          </p>
        ) : null}

        <style>{`
          .ms-sheet {
            animation: ms-sheet-in 220ms cubic-bezier(0.18, 0.9, 0.32, 1);
          }
          @keyframes ms-sheet-in {
            0%   { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0);     opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
