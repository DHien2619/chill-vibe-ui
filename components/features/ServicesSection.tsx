import { Palette, Code2, Cpu, Layers, Zap, Globe } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Pixel-perfect interfaces crafted with intention. From wireframes to polished prototypes that users love.",
    accent: "#a855f7",
    tags: ["Figma", "Prototyping", "Design Systems"],
  },
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Clean, performant code that brings designs to life. Next.js, React, and modern web technologies.",
    accent: "#06b6d4",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    icon: Cpu,
    title: "Motion & 3D",
    description:
      "Breathing life into interfaces with Spline, GSAP, and Framer Motion. Because static is boring.",
    accent: "#6366f1",
    tags: ["Spline", "GSAP", "Three.js"],
  },
  {
    icon: Layers,
    title: "Brand Identity",
    description:
      "Cohesive visual languages that tell your story. Logos, color systems, and typography that stick.",
    accent: "#f472b6",
    tags: ["Branding", "Logo", "Identity"],
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Lightning-fast experiences with Core Web Vitals in mind. Speed is a feature, not an afterthought.",
    accent: "#fbbf24",
    tags: ["Optimization", "CDN", "Analytics"],
  },
  {
    icon: Globe,
    title: "Launch & Scale",
    description:
      "From Vercel deploys to full infrastructure. We ship fast and scale with your growth.",
    accent: "#34d399",
    tags: ["Vercel", "DevOps", "CI/CD"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-32 px-6 md:px-10">
      {/* Background accent */}
      <div
        className="orb w-[500px] h-[500px] top-1/2 right-[-200px] opacity-10"
        style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px w-12"
              style={{ background: "linear-gradient(to right, #a855f7, transparent)" }}
            />
            <span className="text-sm font-medium" style={{ color: "#a855f7" }}>
              What we do
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Services that
            <br />
            <span className="gradient-text">drive results</span>
          </h2>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="glass-card card-hover p-6 rounded-2xl group cursor-pointer"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${service.accent}18` }}
                >
                  <Icon className="w-6 h-6" style={{ color: service.accent }} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#888899" }}>
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: `${service.accent}15`,
                        color: service.accent,
                        border: `1px solid ${service.accent}30`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
