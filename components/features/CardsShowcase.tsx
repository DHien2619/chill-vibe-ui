"use client";

import { useState } from "react";
import { Swords, Shield, Flame, Zap, Wind, Waves } from "lucide-react";

const cards = [
  {
    id: 1,
    name: "Shadow Blade",
    type: "Attack",
    element: "Dark",
    power: 95,
    rarity: "Legendary",
    Icon: Swords,
    gemColor: "#f97316",
    cardBg: "from-violet-900 via-purple-800 to-indigo-900",
    accentColor: "#f97316",
    description: "Strikes from the void with unstoppable force",
  },
  {
    id: 2,
    name: "Crystal Ward",
    type: "Defense",
    element: "Arcane",
    power: 88,
    rarity: "Epic",
    Icon: Shield,
    gemColor: "#a855f7",
    cardBg: "from-purple-900 via-violet-800 to-purple-900",
    accentColor: "#a855f7",
    description: "An ancient shield crystallized by pure magic",
  },
  {
    id: 3,
    name: "Inferno Drake",
    type: "Attack",
    element: "Fire",
    power: 92,
    rarity: "Legendary",
    Icon: Flame,
    gemColor: "#ef4444",
    cardBg: "from-red-900 via-orange-900 to-purple-900",
    accentColor: "#ef4444",
    description: "A dragon born from the heart of a volcano",
  },
  {
    id: 4,
    name: "Storm Caller",
    type: "Magic",
    element: "Lightning",
    power: 85,
    rarity: "Epic",
    Icon: Zap,
    gemColor: "#fbbf24",
    cardBg: "from-yellow-900 via-amber-900 to-purple-900",
    accentColor: "#fbbf24",
    description: "Commands the fury of a thousand storms",
  },
  {
    id: 5,
    name: "Gale Spirit",
    type: "Support",
    element: "Wind",
    power: 78,
    rarity: "Rare",
    Icon: Wind,
    gemColor: "#34d399",
    cardBg: "from-emerald-900 via-teal-900 to-purple-900",
    accentColor: "#34d399",
    description: "Moves with the speed of the tempest winds",
  },
  {
    id: 6,
    name: "Tide Serpent",
    type: "Attack",
    element: "Water",
    power: 81,
    rarity: "Epic",
    Icon: Waves,
    gemColor: "#38bdf8",
    cardBg: "from-sky-900 via-blue-900 to-purple-900",
    accentColor: "#38bdf8",
    description: "Rises from the deep to devour its prey",
  },
];

const rarityColors: Record<string, string> = {
  Legendary: "#f97316",
  Epic: "#a855f7",
  Rare: "#38bdf8",
};

function GameCard({ card, isCenter }: { card: typeof cards[0]; isCenter: boolean }) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 select-none ${
        isCenter ? "scale-110 z-20" : "scale-95 opacity-80 hover:opacity-100 hover:scale-100"
      }`}
      style={{
        width: "180px",
        height: "260px",
        background: `linear-gradient(160deg, var(--from), var(--to))`,
        border: `2px solid ${isCenter ? card.gemColor : "rgba(192,132,252,0.25)"}`,
        boxShadow: isCenter
          ? `0 0 40px ${card.gemColor}60, 0 0 80px ${card.gemColor}30, 0 20px 60px rgba(0,0,0,0.6)`
          : "0 10px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* BG gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${card.cardBg}`}
        style={{ opacity: 0.9 }}
      />

      {/* Top ornament */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${card.gemColor}, transparent)` }} />

      {/* Rarity badge */}
      <div
        className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
        style={{ background: `${rarityColors[card.rarity]}25`, color: rarityColors[card.rarity], border: `1px solid ${rarityColors[card.rarity]}50` }}
      >
        {card.rarity}
      </div>

      {/* Power */}
      <div className="absolute top-3 right-3 text-sm font-black" style={{ color: card.gemColor }}>
        {card.power}
      </div>

      {/* Center gem + portrait */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        {/* Ornate frame */}
        <div
          className="relative w-24 h-24 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${card.gemColor}30 0%, transparent 70%)`,
          }}
        >
          {/* Diamond frame corners */}
          {["-top-2 -left-2", "-top-2 -right-2", "-bottom-2 -left-2", "-bottom-2 -right-2"].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-4 h-4`}
              style={{
                background: `${card.gemColor}40`,
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                border: `1px solid ${card.gemColor}80`,
              }}
            />
          ))}
          {/* Pentagon gem frame + portrait inside */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Pentagon background (no overflow clip on image) */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${card.gemColor}, ${card.gemColor}80)`,
                boxShadow: `0 0 20px ${card.gemColor}80, 0 0 40px ${card.gemColor}40`,
                clipPath: "polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)",
              }}
            />
            {/* Icon — fantasy element symbol inside pentagon */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <card.Icon
                className="w-9 h-9"
                color="#ffffff"
                strokeWidth={2.25}
                style={{
                  filter: `drop-shadow(0 0 6px ${card.gemColor}) drop-shadow(0 2px 4px rgba(0,0,0,0.6))`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Crossed swords decorations */}
        <div className="flex items-center gap-1 mt-1 opacity-60">
          <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${card.gemColor})` }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: card.gemColor }} />
          <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${card.gemColor})` }} />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
        <div className="text-sm font-black text-white tracking-wide">{card.name}</div>
        <div className="text-[10px] font-medium mt-0.5" style={{ color: card.gemColor }}>
          {card.element} · {card.type}
        </div>
      </div>
    </div>
  );
}

export default function CardsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="collection" className="relative py-24 px-6 md:px-10 overflow-hidden">
      <div className="orb w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #c084fc)" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#c084fc" }}>Card Collection</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #c084fc)" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Over <span className="gradient-text">500 Legendary</span> Cards
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "#9d7fd4" }}>
            Each card is a unique weapon of power. Collect, upgrade, and unleash devastation upon your enemies.
          </p>
        </div>

        {/* Cards grid — wraps on smaller screens, single row on xl+ */}
        <div className="relative flex flex-wrap items-center justify-center gap-5 md:gap-6 mb-10 px-2">
          {cards.map((card, i) => (
            <div key={card.id} onClick={() => setActiveIndex(i)} className="shrink-0">
              <GameCard card={card} isCenter={i === activeIndex} />
            </div>
          ))}
        </div>

        {/* Active card description */}
        <div className="text-center">
          <p className="text-sm italic" style={{ color: "#9d7fd4" }}>
            &ldquo;{cards[activeIndex].description}&rdquo;
          </p>
          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeIndex ? "24px" : "8px",
                  height: "8px",
                  background: i === activeIndex
                    ? "linear-gradient(90deg, #c084fc, #f97316)"
                    : "rgba(192,132,252,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
