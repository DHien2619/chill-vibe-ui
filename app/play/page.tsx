"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { joinSharedRoom, loadMe, resetRoom } from "@/lib/room-store";
import { AVATARS } from "@/lib/room-logic";

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Line|Zalo|Messenger/i.test(ua);
}

export default function PlayPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    setAvatar(AVATARS[Math.floor(Math.random() * AVATARS.length)]);
    setInApp(isInAppBrowser());
    router.prefetch("/room");
    const me = loadMe();
    if (me) router.replace("/room");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (inputRef.current?.value ?? "").trim();
    if (busy) return;
    if (!name) {
      setErr("Vui lòng nhập tên");
      return;
    }
    setErr("");
    setBusy(true);
    const res = await joinSharedRoom(name, avatar);
    if (!res.ok) {
      setErr(res.error);
      setBusy(false);
      return;
    }
    router.push("/room");
  };

  const handleForceReset = async () => {
    const name = (inputRef.current?.value ?? "").trim();
    if (!name) {
      setErr("Vui lòng nhập tên");
      return;
    }
    if (
      !window.confirm(
        "Xoá phòng hiện tại và tạo phòng mới?\nMọi người đang trong phòng sẽ bị mất kết nối."
      )
    ) {
      return;
    }
    setErr("");
    setBusy(true);
    await resetRoom();
    const res = await joinSharedRoom(name, avatar);
    if (!res.ok) {
      setErr(res.error);
      setBusy(false);
      return;
    }
    router.push("/room");
  };

  const showResetCta =
    err.includes("Ván đang diễn ra") ||
    err.includes("Phòng đã đầy") ||
    err.includes("đã có người dùng");

  return (
    <main className="min-h-[100svh] flex flex-col ms-page-enter" style={{ background: "#0e0818" }}>
      <div className="orb w-[360px] h-[360px] top-[-100px] right-[-60px] opacity-25"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)" }} />
      <div className="orb w-[320px] h-[320px] bottom-[-100px] left-[-60px] opacity-20"
        style={{ background: "radial-gradient(circle, #f97316 0%, transparent 65%)" }} />

      <header className="relative z-10 px-5 pt-5 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{
            background: "rgba(45,31,78,0.5)",
            color: "#c4b3e0",
            border: "1px solid rgba(192,132,252,0.2)",
          }}
        >
          <ArrowLeft size={14} />
          Quay lại
        </Link>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center">
          <div
            className="w-28 h-28 rounded-3xl overflow-hidden mb-6"
            style={{
              background: "linear-gradient(155deg, #3b2566, #1a1030)",
              border: "2px solid rgba(192,132,252,0.4)",
              boxShadow: "0 0 28px rgba(192,132,252,0.4)",
            }}
          >
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <h1 className="text-3xl font-black text-white mb-1">Tên của bạn?</h1>
          <p className="text-sm mb-6 text-center" style={{ color: "#9d7fd4" }}>
            Bạn bè sẽ nhận ra bạn trong làng bằng tên này
          </p>

          <label className="block w-full mb-3">
            <span className="block text-[11px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9d7fd4" }}>
              Nhập tên
            </span>
            <input
              ref={inputRef}
              type="text"
              maxLength={16}
              placeholder="vd: Linh, Nam, ..."
              enterKeyHint="go"
              autoComplete="off"
              className="w-full h-14 px-4 rounded-xl text-lg text-white outline-none"
              style={{
                background: "rgba(45,31,78,0.6)",
                border: "1.5px solid rgba(192,132,252,0.3)",
                WebkitAppearance: "none",
                fontSize: "16px",
              }}
            />
          </label>

          {err && (
            <div
              className="w-full px-3 py-2 rounded-lg text-xs font-medium mb-3"
              style={{
                background: "rgba(239,68,68,0.15)",
                color: "#fca5a5",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {err}
            </div>
          )}

          {showResetCta && (
            <button
              type="button"
              onClick={handleForceReset}
              className="w-full h-11 mb-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              style={{
                background: "rgba(251,191,36,0.15)",
                color: "#fcd34d",
                border: "1px solid rgba(251,191,36,0.35)",
              }}
            >
              <RotateCcw size={13} />
              Xoá phòng & tạo phòng mới
            </button>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-base font-black uppercase tracking-wider text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #c084fc 0%, #f97316 100%)",
              boxShadow: "0 10px 32px rgba(192,132,252,0.4)",
            }}
          >
            {busy ? "Đang vào phòng..." : "Vào phòng"}
          </button>

          {inApp && (
            <a
              href={`x-safari-https://${typeof window !== "undefined" ? window.location.host : "chill-vibe-ui.vercel.app"}/play`}
              onClick={(e) => {
                e.preventDefault();
                // Fallback: copy link + hướng dẫn
                const url = window.location.href;
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(url);
                }
                window.open(url, "_blank");
              }}
              className="w-full h-11 mt-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              style={{
                background: "rgba(59,130,246,0.15)",
                color: "#93c5fd",
                border: "1px solid rgba(59,130,246,0.35)",
              }}
            >
              Nếu không vào được — mở bằng Safari
            </a>
          )}
        </form>
      </div>
    </main>
  );
}
