import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Nebula Dashboard",
    category: "SaaS Platform",
    description: "Analytics dashboard with real-time data visualization and dark theme.",
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
    accent: "#a855f7",
    year: "2024",
    tags: ["Next.js", "Motion", "3D"],
    featured: true,
  },
  {
    title: "Drift Agency",
    category: "Brand + Web",
    description: "Full brand identity and website for a creative motion studio.",
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    accent: "#06b6d4",
    year: "2024",
    tags: ["Branding", "GSAP"],
    featured: false,
  },
  {
    title: "Orion Finance",
    category: "Fintech App",
    description: "Intuitive mobile-first investment platform with glassmorphism UI.",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    accent: "#f472b6",
    year: "2023",
    tags: ["React", "Framer"],
    featured: false,
  },
  {
    title: "Echo Music",
    category: "Consumer App",
    description: "Music streaming experience with spatial audio and immersive visuals.",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    accent: "#fbbf24",
    year: "2023",
    tags: ["Spline", "WebGL"],
    featured: false,
  },
];

export default function WorkSection() {
  const [featured, ...rest] = projects;

  return (
    <section id="work" className="relative py-32 px-6 md:px-10">
      <div
        className="orb w-[600px] h-[600px] bottom-0 left-[-200px] opacity-10"
        style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-px w-12"
                style={{ background: "linear-gradient(to right, #06b6d4, transparent)" }}
              />
              <span className="text-sm font-medium" style={{ color: "#06b6d4" }}>
                Selected work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Projects we're
              <br />
              <span className="gradient-text">proud of</span>
            </h2>
          </div>
          <a
            href="#"
            className="group flex items-center gap-2 text-sm font-medium glass-card px-5 py-2.5 rounded-full text-white hover:border-purple-500/40 transition-all"
          >
            View all work
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Featured project */}
        <div
          className="glass-card card-hover rounded-3xl overflow-hidden mb-5 cursor-pointer group"
          style={{ minHeight: "420px" }}
        >
          <div className="grid md:grid-cols-2 h-full">
            {/* Visual */}
            <div
              className={`relative h-64 md:h-full bg-gradient-to-br ${featured.gradient} flex items-center justify-center`}
            >
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 30%, white 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
              <div
                className="w-32 h-32 rounded-3xl opacity-30"
                style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
              />
              <div
                className="absolute w-20 h-20 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", top: "30%", left: "35%" }}
              />
            </div>

            {/* Info */}
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: `${featured.accent}20`, color: featured.accent }}
                  >
                    Featured
                  </span>
                  <span className="text-xs" style={{ color: "#888899" }}>{featured.year}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{featured.title}</h3>
                <p className="text-sm mb-4" style={{ color: featured.accent }}>{featured.category}</p>
                <p className="leading-relaxed" style={{ color: "#888899" }}>{featured.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#c4b5fd" }}
                  >
                    {tag}
                  </span>
                ))}
                <a
                  href="#"
                  className="ml-auto flex items-center gap-1.5 text-xs font-medium text-white hover:text-purple-400 transition-colors"
                >
                  View case study
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rest.map((project) => (
            <div
              key={project.title}
              className="glass-card card-hover rounded-2xl overflow-hidden cursor-pointer group"
            >
              <div
                className={`h-48 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center`}
              >
                <div
                  className="w-16 h-16 rounded-2xl opacity-30"
                  style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold text-white">{project.title}</h3>
                  <ArrowUpRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: project.accent }}
                  />
                </div>
                <p className="text-xs mb-2" style={{ color: project.accent }}>{project.category}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#888899" }}>
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
