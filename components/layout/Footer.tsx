import { Zap, Globe, Code, Link2, Camera } from "lucide-react";

const footerLinks = {
  Studio: ["About", "Work", "Services", "Blog"],
  Connect: ["Twitter", "GitHub", "LinkedIn", "Dribbble"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

export default function Footer() {
  return (
    <footer
      className="relative border-t px-6 md:px-10 py-16"
      style={{ borderColor: "rgba(168,85,247,0.12)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)" }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Lumina</span>
            </div>
            <p className="text-sm leading-relaxed max-w-[180px]" style={{ color: "#888899" }}>
              Digital experiences that captivate, convert, and inspire.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Globe, Code, Link2, Camera].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center glass-card hover:border-purple-500/40 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "#888899" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: "#888899" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs" style={{ color: "#888899" }}>
            © 2024 Lumina Studio. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#888899" }}>
            Crafted with{" "}
            <span className="gradient-text font-medium">Next.js + Tailwind</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
