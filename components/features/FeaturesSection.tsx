"use client";
import { Swords, Users, Trophy, Sparkles, Lock, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Swords,
    title: "Real-Time PvP Battles",
    desc: "Challenge players worldwide in fast-paced 1v1 duels. React, adapt, and outmaneuver in live combat.",
    color: "#f97316",
  },
  {
    icon: Users,
    title: "Guild Wars",
    desc: "Form powerful alliances with friends. Conquer guild territories and earn exclusive legendary rewards.",
    color: "#c084fc",
  },
  {
    icon: Trophy,
    title: "Season Tournaments",
    desc: "Compete in ranked seasons for rare cards, titles, and a spot on the global leaderboard.",
    color: "#fbbf24",
  },
  {
    icon: Sparkles,
    title: "Card Fusion",
    desc: "Merge duplicate cards to forge more powerful versions with enhanced abilities and higher stats.",
    color: "#34d399",
  },
  {
    icon: Lock,
    title: "Dungeon Raids",
    desc: "Team up with allies to crack open ancient dungeons and unlock hidden card blueprints.",
    color: "#38bdf8",
  },
  {
    icon: RefreshCw,
    title: "Daily Quests",
    desc: "Complete daily challenges to earn card packs, gold, and special event rewards every 24 hours.",
    color: "#a78bfa",
  },
];

export default function FeaturesSection() {
  return (
    <section id="battle" className="relative py-24 px-6 md:px-10">
      <div className="orb w-[400px] h-[400px] bottom-0 right-0 opacity-10"
        style={{ background: "radial-gradient(circle, #c084fc 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #f97316)" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#f97316" }}>Game Modes</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #f97316)" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Epic Battles <span className="gradient-text">Await You</span>
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "#9d7fd4" }}>
            From solo dungeons to massive guild wars — every game mode tests your strategy and deck mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden"
                style={{
                  background: "rgba(45,31,78,0.4)",
                  border: "1px solid rgba(192,132,252,0.15)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${f.color}50`;
                  (e.currentTarget as HTMLElement).style.background = `rgba(45,31,78,0.7)`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${f.color}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,252,0.15)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(45,31,78,0.4)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9d7fd4" }}>{f.desc}</p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
