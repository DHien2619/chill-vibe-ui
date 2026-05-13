const rarities = [
  {
    tier: "Common",
    color: "#9ca3af",
    glow: "#9ca3af",
    count: "200+",
    desc: "Solid foundation cards. Essential for every deck build.",
    shape: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  },
  {
    tier: "Rare",
    color: "#38bdf8",
    glow: "#38bdf8",
    count: "120+",
    desc: "Powerful abilities with unique synergies. Hard to find, worth the hunt.",
    shape: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  },
  {
    tier: "Epic",
    color: "#a855f7",
    glow: "#a855f7",
    count: "80+",
    desc: "Game-changing cards that shift the tide of battle instantly.",
    shape: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  },
  {
    tier: "Legendary",
    color: "#f97316",
    glow: "#f97316",
    count: "30+",
    desc: "Mythical cards of immense power. The rarest and most sought after.",
    shape: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  },
];

export default function RaritySection() {
  return (
    <section className="relative py-24 px-6 md:px-10 overflow-hidden">
      <div className="orb w-[500px] h-[500px] top-1/2 left-[-100px] -translate-y-1/2 opacity-10"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #fbbf24)" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#fbbf24" }}>Rarity Tiers</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #fbbf24)" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            From Common to <span className="gradient-text">Legendary</span>
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "#9d7fd4" }}>
            Four tiers of power await. The higher the rarity, the greater the reward — and the fiercer the fight to claim it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rarities.map((r) => (
            <div
              key={r.tier}
              className="group relative p-6 rounded-2xl text-center transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(160deg, rgba(45,31,78,0.6), rgba(14,8,24,0.8))`,
                border: `1px solid ${r.color}30`,
              }}
            >
              {/* Gem icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${r.color}, ${r.color}80)`,
                    clipPath: r.shape,
                    boxShadow: `0 0 30px ${r.glow}60, 0 0 60px ${r.glow}30`,
                  }}
                />
              </div>

              {/* Glow line */}
              <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }} />

              <div className="text-2xl font-black mb-1" style={{ color: r.color }}>{r.count}</div>
              <div className="text-lg font-bold text-white mb-2">{r.tier}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#9d7fd4" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
