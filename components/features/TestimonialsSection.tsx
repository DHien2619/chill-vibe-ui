import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Lumina completely reimagined how we think about our digital presence. The motion work on our site is unreal — clients always ask who built it.",
    author: "Sarah Chen",
    role: "CEO, Drift Agency",
    avatar: "SC",
    accent: "#a855f7",
  },
  {
    quote:
      "Working with Lumina felt like having a design co-founder. They understood our vision immediately and shipped faster than we thought possible.",
    author: "Marcus Rivera",
    role: "Founder, Nebula Labs",
    avatar: "MR",
    accent: "#06b6d4",
  },
  {
    quote:
      "The attention to detail is insane. Every micro-interaction, every transition — it all feels intentional. Our conversion rate jumped 40% after launch.",
    author: "Priya Nair",
    role: "Head of Product, Orion Finance",
    avatar: "PN",
    accent: "#f472b6",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-32 px-6 md:px-10">
      <div
        className="orb w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px w-12"
              style={{ background: "linear-gradient(to right, transparent, #a855f7)" }}
            />
            <span className="text-sm font-medium" style={{ color: "#a855f7" }}>
              What clients say
            </span>
            <div
              className="h-px w-12"
              style={{ background: "linear-gradient(to left, transparent, #a855f7)" }}
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Words from people
            <br />
            <span className="gradient-text">who trust us</span>
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.author} className="glass-card card-hover rounded-2xl p-7 flex flex-col gap-5">
              <Quote className="w-8 h-8 opacity-60" style={{ color: t.accent }} />
              <p className="text-base leading-relaxed flex-1" style={{ color: "#c4b5fd" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent}88)` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.author}</div>
                  <div className="text-xs" style={{ color: "#888899" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos row */}
        <div className="mt-20 text-center">
          <p className="text-sm mb-8" style={{ color: "#888899" }}>
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {["Vercel", "Linear", "Loom", "Notion", "Framer", "Figma"].map((brand) => (
              <span
                key={brand}
                className="text-base font-semibold tracking-wide opacity-30 hover:opacity-60 transition-opacity cursor-pointer"
                style={{ color: "#f0f0ff" }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
