import { ArrowRight, Mail } from "lucide-react";

export default function CtaSection() {
  return (
    <section id="contact" className="relative py-32 px-6 md:px-10">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center">
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(6,182,212,0.1) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              border: "1px solid rgba(168,85,247,0.2)",
              borderRadius: "1.5rem",
            }}
          />

          {/* Orbs inside card */}
          <div
            className="orb w-72 h-72 top-[-50px] left-[-50px] opacity-30"
            style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
          />
          <div
            className="orb w-48 h-48 bottom-[-30px] right-0 opacity-20"
            style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }}
          />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to build
              <br />
              <span className="gradient-text">something amazing?</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: "#888899" }}>
              Tell us about your project. We typically respond within 24 hours and love
              jumping on discovery calls.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@lumina.studio"
                className="group flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base transition-all duration-300 btn-primary"
                style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
              >
                <Mail className="w-4 h-4" />
                Start a project
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 glass-card text-white"
              >
                Schedule a call
              </a>
            </div>

            <p className="text-xs mt-8" style={{ color: "#888899" }}>
              No commitment. 100% free discovery call.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
