"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Play, Users, RotateCcw, Bot, Trash2, Eye } from "lucide-react";
import { PlayerAvatar } from "@/components/features/PlayerAvatar";
import {
  PlayerActionSheet,
  HOST_QUICK_ACTIONS,
  type QuickAction,
} from "@/components/features/PlayerActionSheet";
import { RoleConfigPanel } from "@/components/features/RoleConfigPanel";
import { RoleWheel } from "@/components/features/RoleWheel";
import { NotesSection } from "@/components/features/HostBoard";
import {
  loadMe,
  fetchRoom,
  leaveRoom,
  subscribeRoom,
  updateConfig,
  startGame,
  resetToLobby,
  addBot,
  removeAllBots,
  transferHost,
  addNote,
  deleteNote,
  advancePhase,
  heartbeat,
  setPlayerDead,
  saveMe,
  type Player,
  type RoomState,
  MAX_PLAYERS,
} from "@/lib/room-store";
import { ROLE_BY_ID } from "@/lib/roles";
import * as logic from "@/lib/room-logic";

export default function RoomPage() {
  const router = useRouter();
  const [room, setRoom] = useState<RoomState | null>(null);
  const [me, setMe] = useState<Player | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [revealSeen, setRevealSeen] = useState(false);
  const [startErr, setStartErr] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
    const meData = loadMe();
    if (!meData) {
      router.replace("/play");
      return;
    }
    setMe(meData.player);
    fetchRoom().then((r) => setRoom(r));
    const unsub = subscribeRoom((next) => {
      if (!next) {
        router.replace("/");
        return;
      }
      setRoom(next);
    });
    return unsub;
  }, [router]);

  useEffect(() => {
    if (room?.status === "lobby") setRevealSeen(false);
  }, [room?.status]);

  // Keep `me.isHost` in sync if host got transferred.
  useEffect(() => {
    if (!room || !me) return;
    const myCurrent = room.players.find((p) => p.id === me.id);
    if (myCurrent && myCurrent.isHost !== me.isHost) {
      const updated = { ...me, isHost: myCurrent.isHost };
      setMe(updated);
      saveMe(updated);
    }
  }, [room, me]);

  // Heartbeat: cập nhật lastSeen mỗi 30s + 1 lần ngay khi vào
  useEffect(() => {
    if (!me) return;
    void heartbeat(me.id);
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") void heartbeat(me.id);
    }, 30_000);
    return () => window.clearInterval(t);
  }, [me]);

  const slots = useMemo(() => {
    const list: (Player | null)[] = Array.from({ length: MAX_PLAYERS }, () => null);
    if (room) room.players.forEach((p, i) => (list[i] = p));
    return list;
  }, [room]);

  if (!hydrated || !room || !me) {
    return (
      <main className="min-h-[100svh] flex items-center justify-center" style={{ background: "#0e0818" }}>
        <span className="text-sm" style={{ color: "#9d7fd4" }}>Đang vào phòng...</span>
      </main>
    );
  }

  const isHost = me.id === room.hostId;
  const filled = room.players.length;
  const playersForRoles = filled - 1;
  const canStart = isHost && playersForRoles >= 3 && room.status === "lobby";

  const handleLeave = async () => {
    if (typeof window !== "undefined") window.sessionStorage.removeItem("ms-me");
    router.replace("/");
    void leaveRoom(me.id);
  };

  const handleConfigChange = async (roleId: string, delta: number) => {
    if (!isHost) return;
    if (room) setRoom(logic.updateConfig(room, roleId, delta, me.id));
    const next = await updateConfig(roleId, delta, me.id);
    if (next) setRoom(next);
  };

  const handleStart = async () => {
    setStartErr("");
    const res = await startGame(me.id);
    if (!res.ok) {
      setStartErr(res.error);
      return;
    }
    setRoom(res.room);
  };

  const handleReset = async () => {
    if (room) setRoom(logic.resetToLobby(room, me.id));
    const next = await resetToLobby(me.id);
    if (next) setRoom(next);
  };

  const handleAddBot = async () => {
    const next = await addBot(me.id);
    if (next) setRoom(next);
  };

  const handleRemoveBots = async () => {
    const next = await removeAllBots(me.id);
    if (next) setRoom(next);
  };

  const handleTransferHost = async (toId: string) => {
    if (room) setRoom(logic.transferHost(room, me.id, toId));
    setSelectedPlayerId(null);
    const next = await transferHost(me.id, toId);
    if (next) setRoom(next);
  };

  const handleAddNote = async (text: string) => {
    if (room) setRoom(logic.addNote(room, text, me.id));
    const next = await addNote(text, me.id);
    if (next) setRoom(next);
  };

  const handleDeleteNote = async (id: string) => {
    if (room) setRoom(logic.deleteNote(room, id, me.id));
    const next = await deleteNote(id, me.id);
    if (next) setRoom(next);
  };


  const handleAdvancePhase = async () => {
    if (room) setRoom(logic.advancePhase(room, me.id));
    const next = await advancePhase(me.id);
    if (next) setRoom(next);
  };

  const botCount = room.players.filter((p) => p.isBot).length;
  const canAddBot = isHost && room.status === "lobby" && filled < MAX_PLAYERS;
  const myRoleId = room.assignments?.[me.id];
  const myRole = myRoleId ? ROLE_BY_ID[myRoleId] : undefined;
  const showWheel = room.status === "revealing" && myRoleId && !revealSeen;
  const selectedPlayer = selectedPlayerId
    ? room.players.find((p) => p.id === selectedPlayerId)
    : null;
  // Host không có role → vào thẳng cheatsheet
  const showCheatsheet = isHost && room.status === "revealing";

  const handlePlayerTap = (player: Player) => {
    if (player.id === me.id) return;
    setSelectedPlayerId(player.id);
  };

  return (
    <main className="min-h-[100svh] pb-32" style={{ background: "#0e0818" }}>
      <div className="orb w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)" }} />

      <header className="relative z-10 px-4 pt-5 max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={handleLeave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{
              background: "rgba(239,68,68,0.12)",
              color: "#fca5a5",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <LogOut size={13} />
            Rời phòng
          </button>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{
              background: "rgba(45,31,78,0.6)",
              color: "#c4b3e0",
              border: "1px solid rgba(192,132,252,0.2)",
            }}
          >
            <Users size={13} />
            {filled}/{MAX_PLAYERS}
          </div>
        </div>

        <div className="text-center mb-5">
          <h1 className="text-3xl font-black text-white mb-1">
            <span className="gradient-text">Đêm Ma Sói</span>
          </h1>
          <p className="text-xs uppercase tracking-widest" style={{ color: "#9d7fd4" }}>
            {room.status === "lobby"
              ? "Sảnh chờ"
              : room.status === "revealing"
              ? `${room.currentPhase === "day" ? "Ngày" : "Đêm"} ${room.currentRound || 1}`
              : "Kết thúc"}
          </p>
        </div>
      </header>

      <div
        className={
          showCheatsheet
            ? "relative z-10 px-4 max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-5 md:items-start space-y-5 md:space-y-0"
            : "relative z-10 px-4 max-w-2xl mx-auto space-y-5"
        }
      >
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-black text-white uppercase tracking-wider">
            Người chơi
          </h2>
          {isHost && room.status === "lobby" && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAddBot}
                disabled={!canAddBot}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "rgba(192,132,252,0.15)",
                  color: "#c084fc",
                  border: "1px solid rgba(192,132,252,0.3)",
                }}
              >
                <Bot size={12} />
                Thêm bot
              </button>
              {botCount > 0 && (
                <button
                  type="button"
                  onClick={handleRemoveBots}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    color: "#fca5a5",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                  title={`Xoá ${botCount} bot`}
                >
                  <Trash2 size={12} />
                  Xoá ({botCount})
                </button>
              )}
            </div>
          )}
        </div>
        <div
          className="rounded-3xl p-4 md:p-5"
          style={{
            background: "linear-gradient(165deg, rgba(45,31,78,0.55), rgba(26,16,48,0.55))",
            border: "1px solid rgba(192,132,252,0.15)",
          }}
        >
          <div className="grid grid-cols-4 gap-2.5 md:gap-3">
            {slots.map((p, i) => {
              if (!p) {
                return (
                  <div key={i} className="flex justify-center">
                    <PlayerAvatar isEmpty size="sm" />
                  </div>
                );
              }
              const hostCanSeeRole = isHost && room.status === "revealing";
              const rid = hostCanSeeRole ? room.assignments?.[p.id] : undefined;
              const role = rid ? ROLE_BY_ID[rid] : undefined;
              return (
                <div key={i} className="flex justify-center">
                  <PlayerAvatar
                    name={p.name}
                    isMe={p.id === me.id}
                    isHost={p.isHost}
                    isBot={p.isBot}
                    isDead={p.isDead}
                    avatar={p.avatar}
                    size="sm"
                    roleLabel={role?.name}
                    roleColor={role?.color}
                    onClick={
                      p.id === me.id ? undefined : () => handlePlayerTap(p)
                    }
                  />
                </div>
              );
            })}
          </div>
          {isHost && room.status === "lobby" && (
            <p className="text-[10px] mt-3 text-center" style={{ color: "#9d7fd4" }}>
              Chạm vào avatar người khác để chuyển quản trò
            </p>
          )}
        </div>
      </section>

      {room.status === "lobby" && (
        <section>
          <RoleConfigPanel
            config={room.config}
            playerCount={playersForRoles}
            canEdit={isHost}
            onChange={handleConfigChange}
          />
        </section>
      )}

      {showCheatsheet && (
        <section>
          <NotesSection
            players={room.players.filter((p) => !p.isHost)}
            notes={room.notes || []}
            currentRound={room.currentRound || 1}
            currentPhase={room.currentPhase || "night"}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onAdvancePhase={handleAdvancePhase}
          />
        </section>
      )}

      {!isHost && room.status === "revealing" && revealSeen && myRole && (
        <section>
          <div
            className="rounded-3xl p-5 text-center"
            style={{
              background: `linear-gradient(165deg, ${myRole.color}18, rgba(26,16,48,0.6))`,
              border: `1px solid ${myRole.color}45`,
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "#9d7fd4" }}
            >
              Vai trò của bạn
            </p>
            <h3 className="text-2xl font-black text-white mb-2" style={{ color: myRole.color }}>
              {myRole.name}
            </h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#c4b3e0" }}>
              {myRole.blurb}
            </p>
            <p className="text-xs" style={{ color: "#9d7fd4" }}>
              Bỏ điện thoại xuống và bắt đầu chơi ngoài đời. Quản trò sẽ điều khiển ván.
            </p>
            <button
              type="button"
              onClick={() => setRevealSeen(false)}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider"
              style={{
                background: "rgba(192,132,252,0.12)",
                color: "#c084fc",
                border: "1px solid rgba(192,132,252,0.25)",
              }}
            >
              <Eye size={12} />
              Xem lại vai trò
            </button>
          </div>
        </section>
      )}
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-20 px-4 py-4"
        style={{
          background: "linear-gradient(to top, rgba(14,8,24,0.96), rgba(14,8,24,0.7) 80%, transparent)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          {startErr && (
            <div
              className="mb-2 px-3 py-2 rounded-lg text-xs font-medium text-center"
              style={{
                background: "rgba(239,68,68,0.15)",
                color: "#fca5a5",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {startErr}
            </div>
          )}
          {room.status === "lobby" ? (
            isHost ? (
              <button
                disabled={!canStart}
                onClick={handleStart}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-base font-black uppercase tracking-wider text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #c084fc 0%, #f97316 100%)",
                  boxShadow: canStart ? "0 10px 32px rgba(192,132,252,0.4)" : "none",
                }}
              >
                <Play size={18} fill="currentColor" />
                {playersForRoles < 3
                  ? `Cần thêm ${3 - playersForRoles} người chơi`
                  : "Chia bài & bắt đầu"}
              </button>
            ) : (
              <div
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold"
                style={{
                  background: "rgba(45,31,78,0.6)",
                  color: "#c4b3e0",
                  border: "1px solid rgba(192,132,252,0.2)",
                }}
              >
                Đang chờ quản trò bắt đầu...
              </div>
            )
          ) : isHost ? (
            <button
              onClick={handleReset}
              className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold"
              style={{
                background: "rgba(45,31,78,0.7)",
                color: "#e9d5ff",
                border: "1px solid rgba(192,132,252,0.3)",
              }}
            >
              <RotateCcw size={16} />
              Kết thúc ván & về sảnh
            </button>
          ) : (
            <div
              className="w-full h-14 rounded-2xl flex items-center justify-center text-sm font-bold"
              style={{
                background: "rgba(45,31,78,0.6)",
                color: "#c4b3e0",
                border: "1px solid rgba(192,132,252,0.2)",
              }}
            >
              Chờ quản trò kết thúc ván
            </div>
          )}
        </div>
      </div>

      {showWheel && myRoleId && room.revealSeed != null && (
        <RoleWheel
          config={room.config}
          myRoleId={myRoleId}
          seed={room.revealSeed + me.id.length}
          onDone={() => setRevealSeen(true)}
        />
      )}

      {selectedPlayer && (() => {
        const targetRoleId = isHost ? room.assignments?.[selectedPlayer.id] : undefined;
        const targetRole = targetRoleId ? ROLE_BY_ID[targetRoleId] : undefined;
        const hostInGame = isHost && room.status === "revealing" && !selectedPlayer.isHost;
        const handleQuickAction = async (action: QuickAction) => {
          // Optimistic: apply pure logic local cho UI feedback tức thì
          if (room) {
            let local = logic.addNote(room, `${selectedPlayer.name} ${action.template}`, me.id);
            if (action.effect === "kill") {
              local = logic.setPlayerDead(local, me.id, selectedPlayer.id, true);
            } else if (action.effect === "revive") {
              local = logic.setPlayerDead(local, me.id, selectedPlayer.id, false);
            }
            setRoom(local);
          }
          setSelectedPlayerId(null);
          // Server sync in background
          let next = await addNote(`${selectedPlayer.name} ${action.template}`, me.id);
          if (action.effect === "kill") {
            next = (await setPlayerDead(me.id, selectedPlayer.id, true)) ?? next;
          } else if (action.effect === "revive") {
            next = (await setPlayerDead(me.id, selectedPlayer.id, false)) ?? next;
          }
          if (next) setRoom(next);
        };
        const handleRevive = async () => {
          // Optimistic
          if (room) {
            let local = logic.setPlayerDead(room, me.id, selectedPlayer.id, false);
            local = logic.addNote(local, `${selectedPlayer.name} được Phù thủy cứu`, me.id);
            setRoom(local);
          }
          setSelectedPlayerId(null);
          // Server sync
          let next = await setPlayerDead(me.id, selectedPlayer.id, false);
          next = (await addNote(`${selectedPlayer.name} được Phù thủy cứu`, me.id)) ?? next;
          if (next) setRoom(next);
        };
        return (
          <PlayerActionSheet
            target={selectedPlayer}
            targetRole={
              targetRole ? { name: targetRole.name, color: targetRole.color } : undefined
            }
            canTransferHost={
              isHost &&
              room.status === "lobby" &&
              !selectedPlayer.isBot &&
              !selectedPlayer.isHost
            }
            onTransferHost={() => handleTransferHost(selectedPlayer.id)}
            quickActions={hostInGame ? HOST_QUICK_ACTIONS : undefined}
            onQuickAction={hostInGame ? handleQuickAction : undefined}
            onRevive={hostInGame ? handleRevive : undefined}
            onClose={() => setSelectedPlayerId(null)}
          />
        );
      })()}
    </main>
  );
}
