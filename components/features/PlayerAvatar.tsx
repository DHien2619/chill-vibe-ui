"use client";

import { memo } from "react";
import { HelpCircle, Bot, Crown, Skull, Heart, Lock, Target } from "lucide-react";

function PlayerAvatarRaw({
  name,
  isMe = false,
  isHost = false,
  isBot = false,
  isEmpty = false,
  isDead = false,
  isTrapped = false,
  isLocked = false,
  isCupidPaired = false,
  avatar,
  size = "md",
  showName = true,
  onClick,
  roleLabel,
  roleColor,
}: {
  name?: string;
  isMe?: boolean;
  isHost?: boolean;
  isBot?: boolean;
  isEmpty?: boolean;
  isDead?: boolean;
  isTrapped?: boolean;
  isLocked?: boolean;
  isCupidPaired?: boolean;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  onClick?: () => void;
  roleLabel?: string;
  roleColor?: string;
}) {
  const dim = size === "sm" ? 64 : size === "lg" ? 120 : 88;
  const iconSize = size === "sm" ? 28 : size === "lg" ? 56 : 40;

  const borderColor = isHost
    ? "#fbbf24"
    : isMe
    ? "#c084fc"
    : isEmpty
    ? "rgba(192,132,252,0.2)"
    : "rgba(192,132,252,0.25)";

  const glow = isHost
    ? "0 0 22px rgba(251,191,36,0.55), 0 0 44px rgba(251,191,36,0.2)"
    : isMe
    ? "0 0 20px rgba(192,132,252,0.5)"
    : isEmpty
    ? "none"
    : "0 8px 20px rgba(0,0,0,0.45)";

  const Wrapper = onClick ? "button" : "div";
  const wrapperProps = onClick
    ? {
        type: "button" as const,
        onClick,
        "aria-label": name ? `Mở thao tác cho ${name}` : "Mở thao tác",
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`flex flex-col items-center gap-1.5 select-none ${
        onClick ? "cursor-pointer active:scale-95 transition-transform" : ""
      }`}
    >
      <div
        className="relative flex items-center justify-center rounded-2xl overflow-hidden"
        style={{
          width: dim,
          height: dim,
          background: isEmpty
            ? "rgba(45,31,78,0.35)"
            : "linear-gradient(155deg, #3b2566, #1a1030)",
          border: `2px ${isEmpty ? "dashed" : "solid"} ${
            isDead && !isEmpty ? "rgba(239,68,68,0.5)" : borderColor
          }`,
          boxShadow: isDead && !isEmpty ? "0 0 16px rgba(239,68,68,0.35)" : glow,
          opacity: isDead && !isEmpty ? 0.55 : 1,
          filter: isDead && !isEmpty ? "grayscale(0.7)" : "none",
        }}
      >
        {!isEmpty && (
          <>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={name || "avatar"}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 25%, rgba(192,132,252,0.18), transparent 60%)",
                  }}
                />
                {isBot ? (
                  <Bot size={iconSize} color="#9d7fd4" strokeWidth={1.8} />
                ) : (
                  <HelpCircle size={iconSize} color="#c4b3e0" strokeWidth={1.5} />
                )}
              </>
            )}

            {isBot && !isHost && (
              <div
                className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-wider z-10"
                style={{
                  background: "rgba(157,127,212,0.55)",
                  color: "#fff",
                  border: "1px solid rgba(192,132,252,0.6)",
                  backdropFilter: "blur(2px)",
                }}
              >
                BOT
              </div>
            )}

            {isHost && (
              <div
                className="absolute top-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-wider z-10"
                style={{
                  background: "#fbbf24",
                  color: "#0e0818",
                  boxShadow: "0 2px 8px rgba(251,191,36,0.4)",
                }}
              >
                <Crown size={9} />
                QT
              </div>
            )}

            {isMe && (
              <div
                className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-wider z-10"
                style={{
                  background: "#c084fc",
                  color: "#0e0818",
                  boxShadow: "0 2px 8px rgba(192,132,252,0.4)",
                }}
              >
                BẠN
              </div>
            )}

            {!isDead && (isCupidPaired || isTrapped || isLocked) && (
              <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-1 z-20">
                {isCupidPaired && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: "#ec4899",
                      boxShadow: "0 0 8px #ec4899",
                      border: "2px solid #1a1030",
                    }}
                  >
                    <Heart size={10} color="#fff" fill="#fff" />
                  </div>
                )}
                {isTrapped && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: "#d97706",
                      boxShadow: "0 0 8px #d97706",
                      border: "2px solid #1a1030",
                    }}
                  >
                    <Target size={10} color="#fff" />
                  </div>
                )}
                {isLocked && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: "#818cf8",
                      boxShadow: "0 0 8px #818cf8",
                      border: "2px solid #1a1030",
                    }}
                  >
                    <Lock size={10} color="#fff" />
                  </div>
                )}
              </div>
            )}

            {isDead && (
              <div
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.45), rgba(0,0,0,0.4) 80%)",
                }}
              >
                <Skull
                  size={Math.round(dim * 0.55)}
                  color="#fca5a5"
                  strokeWidth={2}
                  style={{
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))",
                  }}
                />
              </div>
            )}
          </>
        )}
        {isEmpty && (
          <span
            className="text-2xl font-black"
            style={{ color: "rgba(192,132,252,0.4)" }}
          >
            +
          </span>
        )}
      </div>

      {!isEmpty && roleLabel && roleColor && (
        <span
          className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider truncate max-w-[88px] text-center"
          style={{
            background: `${roleColor}25`,
            color: roleColor,
            border: `1px solid ${roleColor}55`,
            boxShadow: `0 0 8px ${roleColor}30`,
          }}
        >
          {roleLabel}
        </span>
      )}

      {showName && (
        <span
          className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[100px] text-center"
          style={{
            color: isEmpty
              ? "rgba(192,132,252,0.5)"
              : isDead
              ? "#9ca3af"
              : isHost
              ? "#fde68a"
              : "#e9d5ff",
            textDecoration: isDead ? "line-through" : "none",
          }}
        >
          {isEmpty ? "Trống" : name || "?"}
        </span>
      )}
    </Wrapper>
  );
}

export const PlayerAvatar = memo(PlayerAvatarRaw);
