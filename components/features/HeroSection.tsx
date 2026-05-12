import { ArrowRight, Play, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-10 pt-24 pb-16 overflow-hidden">
      {/* Background orbs */}
      <div
        className="orb w-[600px] h-[600px] top-[-150px] left-[-200px] opacity-30"
        style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[400px] h-[400px] top-[20%] right-[-100px] opacity-20"
        style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[300px] h-[300px] bottom-[10%] left-[30%] opacity-15"
        style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-card">
          <Sparkles className="w-4 h-4" style={{ color: "#a855f7" }} />
          <span className="text-sm font-medium" style={{ color: "#c4b5fd" }}>
            Award-winning digital design studio
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
          <span className="text-white">We craft</span>
          <br />
          <span className="gradient-text">digital magic</span>
          <br />
          <span className="text-white">that moves</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#888899" }}
        >
          From concept to deployment — we build web experiences that captivate,
          convert, and leave people wanting more.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#work"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-base transition-all duration-300 btn-primary"
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
          >
            View our work
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#about"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-base transition-all duration-300 glass-card text-white"
          >
            <Play className="w-4 h-4" style={{ color: "#a855f7" }} />
            Watch the reel
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8">
          {[
            { value: "120+", label: "Projects shipped" },
            { value: "98%", label: "Client satisfaction" },
            { value: "3x", label: "Avg. conversion lift" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm mt-0.5" style={{ color: "#888899" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs" style={{ color: "#888899" }}>scroll</span>
        <div
          className="w-px h-12"
          style={{ background: "linear-gradient(to bottom, #a855f7, transparent)" }}
        />
      </div>
    </section>
  );
}
