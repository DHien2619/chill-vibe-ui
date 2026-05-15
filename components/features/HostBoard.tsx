"use client";

import { Fragment, useMemo, useState } from "react";
import { Send, Trash2, Moon, Sun, ArrowRight } from "lucide-react";
import type { Note, Phase, Player } from "@/lib/room-store";
import { ROLE_TYPES } from "@/lib/roles";

type Token = { match: string; color: string; bg: string };

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTokens(players: Player[]): Token[] {
  const tokens: Token[] = [];
  // Player names: vàng nhạt
  players.forEach((p) =>
    tokens.push({
      match: p.name,
      color: "#fde68a",
      bg: "rgba(251,191,36,0.18)",
    })
  );
  // Role names: màu role
  ROLE_TYPES.forEach((r) =>
    tokens.push({ match: r.name, color: r.color, bg: `${r.color}22` })
  );
  // Sort by length DESC so longer matches win (vd "Phù thủy" trước "Phù")
  tokens.sort((a, b) => b.match.length - a.match.length);
  return tokens;
}

function renderHighlighted(text: string, tokens: Token[]): React.ReactNode {
  if (tokens.length === 0) return text;
  const pattern = tokens.map((t) => escapeRegex(t.match)).join("|");
  const re = new RegExp(`(${pattern})`, "g");
  const parts = text.split(re);
  return parts.map((part, i) => {
    const token = tokens.find((t) => t.match === part);
    if (!token) return <Fragment key={i}>{part}</Fragment>;
    return (
      <span
        key={i}
        className="font-black"
        style={{
          color: token.color,
          background: token.bg,
          padding: "0 5px",
          borderRadius: 5,
          margin: "0 1px",
        }}
      >
        {part}
      </span>
    );
  });
}

export function NotesSection({
  players,
  notes,
  currentRound,
  currentPhase,
  onAddNote,
  onDeleteNote,
  onAdvancePhase,
}: {
  players: Player[];
  notes: Note[];
  currentRound: number;
  currentPhase: Phase;
  onAddNote: (text: string) => void;
  onDeleteNote: (id: string) => void;
  onAdvancePhase: () => void;
}) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onAddNote(draft);
    setDraft("");
  };

  const insertMention = (name: string) => {
    setDraft((d) => (d ? `${d.trimEnd()} ${name} ` : `${name} `));
  };

  const tokens = useMemo(() => buildTokens(players), [players]);

  const isNight = currentPhase === "night";
  const accent = isNight ? "#7c3aed" : "#f59e0b";
  const accentSoft = isNight ? "#c084fc" : "#fbbf24";

  // Next phase preview
  const nextLabel = isNight ? `Ngày ${currentRound}` : `Đêm ${currentRound + 1}`;
  const NextIcon = isNight ? Sun : Moon;

  return (
    <section className="space-y-3">
      <PhaseHeader
        round={currentRound}
        phase={currentPhase}
        accent={accent}
        accentSoft={accentSoft}
      />

      <button
        type="button"
        onClick={onAdvancePhase}
        className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider text-white"
        style={{
          background: isNight
            ? "linear-gradient(135deg, #f59e0b, #f97316)"
            : "linear-gradient(135deg, #6d28d9, #4338ca)",
          boxShadow: isNight
            ? "0 8px 24px rgba(245,158,11,0.35)"
            : "0 8px 24px rgba(109,40,217,0.35)",
        }}
      >
        <NextIcon size={16} />
        Sang {nextLabel}
        <ArrowRight size={14} />
      </button>

      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-base font-black text-white uppercase tracking-wider">
            Diễn biến ván
          </h2>
          <span className="text-[10px] uppercase tracking-wider" style={{ color: "#9d7fd4" }}>
            {notes.length} ghi chú
          </span>
        </div>
        <div
          className="rounded-3xl p-4"
          style={{
            background: "linear-gradient(165deg, rgba(45,31,78,0.55), rgba(26,16,48,0.55))",
            border: "1px solid rgba(192,132,252,0.15)",
          }}
        >
          {notes.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: "#9d7fd4" }}>
              Chạm avatar người chơi để ghi nhanh, hoặc gõ ghi chú tự do bên dưới.
            </p>
          ) : (
            <ol className="space-y-2 mb-4 max-h-[320px] overflow-y-auto">
              {notes.map((note) => (
                <NoteRow
                  key={note.id}
                  note={note}
                  tokens={tokens}
                  onDelete={() => onDeleteNote(note.id)}
                />
              ))}
            </ol>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              maxLength={200}
              placeholder="Ghi chú tự do..."
              className="flex-1 h-11 px-3 rounded-xl text-sm text-white outline-none"
              style={{
                background: "rgba(45,31,78,0.6)",
                border: "1.5px solid rgba(192,132,252,0.3)",
              }}
            />
            <button
              type="button"
              onClick={submit}
              disabled={!draft.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #c084fc, #f97316)",
                boxShadow: "0 6px 18px rgba(192,132,252,0.35)",
              }}
              aria-label="Ghi"
            >
              <Send size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {players.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => insertMention(p.name)}
                className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(192,132,252,0.1)",
                  color: "#c4b3e0",
                  border: "1px solid rgba(192,132,252,0.2)",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhaseHeader({
  round,
  phase,
  accent,
  accentSoft,
}: {
  round: number;
  phase: Phase;
  accent: string;
  accentSoft: string;
}) {
  const Icon = phase === "night" ? Moon : Sun;
  const label = phase === "night" ? "Đêm" : "Ngày";

  return (
    <div
      className="rounded-3xl p-4 flex items-center gap-4"
      style={{
        background: `linear-gradient(135deg, ${accent}25, ${accent}08)`,
        border: `1px solid ${accent}55`,
        boxShadow: `0 0 28px ${accent}25`,
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accentSoft})`,
          boxShadow: `0 0 18px ${accent}80`,
        }}
      >
        <Icon size={26} color="#fff" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accentSoft }}
        >
          Đang diễn ra
        </p>
        <h2 className="text-2xl font-black text-white">
          {label} <span style={{ color: accentSoft }}>{round}</span>
        </h2>
      </div>
    </div>
  );
}

function NoteRow({
  note,
  tokens,
  onDelete,
}: {
  note: Note;
  tokens: Token[];
  onDelete: () => void;
}) {
  const isNight = note.phase === "night";
  const badgeBg = isNight ? "rgba(124,58,237,0.25)" : "rgba(245,158,11,0.25)";
  const badgeColor = isNight ? "#c084fc" : "#fbbf24";
  const badgeBorder = isNight ? "rgba(124,58,237,0.45)" : "rgba(245,158,11,0.45)";

  return (
    <li
      className="flex items-start gap-2 p-2 rounded-xl"
      style={{
        background: "rgba(192,132,252,0.06)",
        border: "1px solid rgba(192,132,252,0.12)",
      }}
    >
      <span
        className="px-1.5 h-5 rounded-md flex items-center justify-center text-[9px] font-black uppercase tracking-wider shrink-0 mt-0.5"
        style={{
          background: badgeBg,
          color: badgeColor,
          border: `1px solid ${badgeBorder}`,
        }}
      >
        {isNight ? "Đ" : "N"}
        {note.round}
      </span>
      <span className="flex-1 text-sm text-white leading-snug break-words">
        {renderHighlighted(note.text, tokens)}
      </span>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center"
        style={{
          background: "rgba(239,68,68,0.1)",
          color: "#fca5a5",
        }}
        aria-label="Xoá"
      >
        <Trash2 size={12} />
      </button>
    </li>
  );
}
