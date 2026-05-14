"use client";

import Link from "next/link";
import { Moon, Play } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 py-12 overflow-hidden ms-page-enter">
      <div className="orb w-[420px] h-[420px] top-[-100px] left-[-80px] opacity-30"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)" }} />
      <div className="orb w-[360px] h-[360px] bottom-[-80px] right-[-60px] opacity-25"
        style={{ background: "radial-gradient(circle, #ef4444 0%, transparent 65%)" }} />
      <div className="orb w-[260px] h-[260px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
        style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 65%)" }} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(45,31,78,0.6)", border: "1px solid rgba(192,132,252,0.3)" }}>
          <Moon size={14} color="#fbbf24" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-yellow-200">
            One Night · Ultimate
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-4">
          <span className="block text-white">Đêm</span>
          <span className="block gradient-text">Ma Sói</span>
        </h1>

        <p className="text-sm md:text-base mb-10 leading-relaxed" style={{ color: "#c4b3e0" }}>
          Mở web — nhập tên — vào phòng.<br />
          Một đêm, một ván. Tối đa <span className="text-white font-bold">16 người</span>.
        </p>

        <Link
          href="/play"
          className="relative w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-lg font-black uppercase tracking-[0.25em] text-white overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #c084fc 0%, #f97316 100%)",
            boxShadow: "0 12px 36px rgba(192,132,252,0.45), 0 0 28px rgba(249,115,22,0.35)",
          }}
        >
          <Play size={22} fill="currentColor" />
          Chơi ngay
        </Link>

        <div className="grid grid-cols-3 gap-3 w-full mt-10">
          {[
            { num: "16", label: "người chơi" },
            { num: "1", label: "đêm duy nhất" },
            { num: "7", label: "vai trò" },
          ].map((s) => (
            <div
              key={s.label}
              className="px-2 py-3 rounded-xl text-center"
              style={{ background: "rgba(45,31,78,0.4)", border: "1px solid rgba(192,132,252,0.15)" }}
            >
              <div className="text-2xl font-black gradient-text">{s.num}</div>
              <div className="text-[9px] mt-0.5 uppercase tracking-wider" style={{ color: "#9d7fd4" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
