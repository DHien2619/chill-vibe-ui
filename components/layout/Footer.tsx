import { Globe, Code, Link2, Camera } from "lucide-react";

const footerLinks = {
  Game: ["Collection", "Battle", "Leaderboard", "Shop"],
  Support: ["FAQ", "Discord", "Contact", "Bug Report"],
  Legal: ["Privacy Policy", "Terms of Use", "Cookies"],
};

export default function Footer() {
  return (
    <footer
      className="relative border-t px-6 md:px-10 py-14"
      style={{ borderColor: "rgba(192,132,252,0.12)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)" }}
              >
                <span className="text-white font-black text-sm tracking-widest">K</span>
              </div>
              <span
                className="font-black text-xl tracking-[0.15em] uppercase"
                style={{
                  background: "linear-gradient(135deg, #e9d5ff, #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Kwtor
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-[180px] mb-5" style={{ color: "#9d7fd4" }}>
              The ultimate fantasy card battle game. Collect, forge, conquer.
            </p>
            <div className="flex items-center gap-2">
              {[Globe, Code, Link2, Camera].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(45,31,78,0.6)",
                    border: "1px solid rgba(192,132,252,0.2)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "#9d7fd4" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-white mb-4 tracking-wide">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: "#9d7fd4" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: "rgba(192,132,252,0.08)" }}
        >
          <p className="text-xs" style={{ color: "#6b5f8a" }}>
            © 2024 Kwtor Game Studio. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#6b5f8a" }}>
            Built with <span className="font-semibold" style={{ color: "#c084fc" }}>Next.js</span> · Deployed on{" "}
            <span className="font-semibold" style={{ color: "#c084fc" }}>Vercel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
