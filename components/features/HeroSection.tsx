"use client";
import { Download, Play, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-10 pt-20 pb-10 overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[700px] h-[700px] top-[-200px] left-1/2 -translate-x-1/2 opacity-25"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)" }} />
      <div className="orb w-[400px] h-[400px] top-[30%] left-[-150px] opacity-20"
        style={{ background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)" }} />
      <div className="orb w-[350px] h-[350px] top-[20%] right-[-100px] opacity-15"
        style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

      {/* Perspective card arena background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 left-0 right-0 h-64 opacity-20"
          style={{
            background: "linear-gradient(to top, #7c3aed, transparent)",
          }}
        />
        {/* Grid lines perspective */}
        <div
          className="absolute bottom-0 left-0 right-0 h-96 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(192,132,252,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(192,132,252,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            transform: "perspective(400px) rotateX(60deg)",
            transformOrigin: "bottom center",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(192,132,252,0.3)",
          }}
        >
          <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#fbbf24" }} />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#e9d5ff" }}>
            Season 4 — The Dark Realm is here
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mb-4">
          <span className="block text-white">COLLECT.</span>
          <span className="block gradient-text">BATTLE.</span>
          <span className="block text-white">CONQUER.</span>
        </h1>

        <p className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "#9d7fd4" }}>
          Unleash legendary cards forged in the darkest magic. Build your deck,
          master the arena, and rise to become the realm's greatest champion.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href="#download"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #c084fc)",
              boxShadow: "0 0 40px rgba(124,58,237,0.4)",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 60px rgba(124,58,237,0.7), 0 10px 30px rgba(0,0,0,0.4)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(124,58,237,0.4)")}
          >
            <Download className="w-4 h-4" />
            Download Free
          </a>
          <a
            href="#trailer"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 glass-card"
            style={{ color: "#e9d5ff" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(192,132,252,0.2)" }}
            >
              <Play className="w-3 h-3 fill-current" style={{ color: "#c084fc" }} />
            </div>
            Watch Trailer
          </a>
        </div>

        {/* Stats */}
        <div
          className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl"
          style={{
            background: "rgba(45,31,78,0.5)",
            border: "1px solid rgba(192,132,252,0.15)",
          }}
        >
          {[
            { value: "5M+", label: "Players" },
            { value: "500+", label: "Unique Cards" },
            { value: "4.9★", label: "App Store" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              {i > 0 && (
                <div
                  className="absolute left-0 top-1/4 bottom-1/4 w-px"
                  style={{ background: "rgba(192,132,252,0.2)" }}
                />
              )}
              <div className="text-xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs" style={{ color: "#9d7fd4" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
