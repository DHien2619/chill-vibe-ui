"use client";

import { useState } from "react";
import { Crown, X, Heart, UserX, Pencil, Check } from "lucide-react";
import type { Player } from "@/lib/room-store";

export type QuickAction = {
  label: string;
  template: string;
  color: string;
  effect?: "kill" | "revive" | "trap" | "lock" | "cupidPair";
};

export const HOST_QUICK_ACTIONS: QuickAction[] = [
  { label: "Treo cổ", template: "bị treo cổ", color: "#ef4444", effect: "kill" },
  { label: "Sói cắn", template: "bị Sói cắn", color: "#dc2626", effect: "kill" },
  { label: "Tiên tri soi", template: "bị Tiên tri soi", color: "#22d3ee" },
  { label: "Bảo vệ", template: "được Bảo vệ chọn", color: "#84cc16" },
  { label: "Phù thủy cứu", template: "được Phù thủy cứu", color: "#c084fc", effect: "revive" },
  { label: "Phù thủy giết", template: "bị Phù thủy giết", color: "#9333ea", effect: "kill" },
  { label: "Thợ săn bắn", template: "bị Thợ săn bắn theo", color: "#f59e0b", effect: "kill" },
  { label: "Bẫy", template: "được TSQT đặt bẫy", color: "#d97706", effect: "trap" },
  { label: "Sói soi", template: "bị Sói Pháp Sư yểm", color: "#a855f7" },
  { label: "Mục Sư vẩy", template: "bị Mục Sư vẩy nước thánh", color: "#14b8a6" },
  { label: "Cupid ghép", template: "được Cupid ghép đôi", color: "#ec4899", effect: "cupidPair" },
  { label: "Khóa chiêu", template: "bị Nguyệt Nữ khóa chiêu", color: "#818cf8", effect: "lock" },
];

export function PlayerActionSheet({
  target,
  targetRole,
  canTransferHost,
  onTransferHost,
  canKick,
  onKick,
  canRenameBot,
  onRenameBot,
  quickActions,
  onQuickAction,
  onRevive,
  onClose,
}: {
  target: Player;
  targetRole?: { name: string; color: string };
  canTransferHost: boolean;
  onTransferHost: () => void;
  canKick?: boolean;
  onKick?: () => void;
  canRenameBot?: boolean;
  onRenameBot?: (newName: string) => void;
  quickActions?: QuickAction[];
  onQuickAction?: (action: QuickAction) => void;
  onRevive?: () => void;
  onClose: () => void;
}) {
  const isDead = !!target.isDead;
  const hasQuickActions = quickActions && quickActions.length > 0 && onQuickAction;
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState(target.name);

  const submitRename = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== target.name && onRenameBot) {
      onRenameBot(trimmed);
    }
    setRenaming(false);
  };

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
              {renaming ? (
                <form
                  className="flex items-center gap-1.5"
                  onSubmit={(e) => { e.preventDefault(); submitRename(); }}
                >
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    maxLength={16}
                    autoFocus
                    className="h-8 px-2 rounded-lg text-sm text-white outline-none w-28"
                    style={{
                      background: "rgba(45,31,78,0.8)",
                      border: "1.5px solid rgba(192,132,252,0.4)",
                    }}
                  />
                  <button
                    type="submit"
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "#22c55e" }}
                  >
                    <Check size={14} color="#fff" />
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-black text-white truncate">{target.name}</h3>
                  {canRenameBot && onRenameBot && (
                    <button
                      type="button"
                      onClick={() => { setDraftName(target.name); setRenaming(true); }}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(192,132,252,0.2)" }}
                      aria-label="Đổi tên"
                    >
                      <Pencil size={11} color="#c4b3e0" />
                    </button>
                  )}
                </>
              )}
              {!renaming && targetRole && (
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

        <div className="flex gap-2">
          {canTransferHost && (
            <button
              type="button"
              onClick={onTransferHost}
              className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider text-white"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f97316)",
                boxShadow: "0 8px 24px rgba(251,191,36,0.35)",
              }}
            >
              <Crown size={16} />
              Làm quản trò
            </button>
          )}

          {canKick && onKick && (
            <button
              type="button"
              onClick={onKick}
              className={`${canTransferHost ? "w-12" : "flex-1"} h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider`}
              style={{
                background: "rgba(239,68,68,0.15)",
                color: "#fca5a5",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <UserX size={16} />
              {!canTransferHost && "Kick"}
            </button>
          )}
        </div>

        {!canTransferHost && !canKick && !hasQuickActions && (
          <p className="text-xs text-center py-3" style={{ color: "#9d7fd4" }}>
            {target.isBot
              ? "Không thể giao quản trò cho bot"
              : target.isHost
              ? "Đây là quản trò hiện tại"
              : "Chỉ quản trò mới có thể chuyển quyền"}
          </p>
        )}

      </div>
    </div>
  );
}
