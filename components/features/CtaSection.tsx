import { Download, Smartphone, Tablet } from "lucide-react";

export default function CtaSection() {
  return (
    <section id="download" className="relative py-28 px-6 md:px-10 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(45,31,78,0.5) 50%, rgba(249,115,22,0.1) 100%)",
            border: "1px solid rgba(192,132,252,0.25)",
          }}
        >
          {/* Corner orbs */}
          <div className="orb w-64 h-64 top-[-60px] left-[-60px] opacity-30"
            style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
          <div className="orb w-48 h-48 bottom-[-40px] right-[-40px] opacity-25"
            style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

          {/* Top deco line */}
          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, #c084fc, #f97316, transparent)" }} />

          <div className="relative z-10">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#f97316" }}
            >
              Free to Play · No Ads · No Pay-to-Win
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Join <span className="gradient-text">5 Million</span>
              <br />Warriors Today
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto mb-10" style={{ color: "#9d7fd4" }}>
              Download Kwtor for free and receive a Legendary starter pack with 3 exclusive cards. Your journey to the top begins now.
            </p>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="#"
                className="flex items-center gap-3 px-7 py-4 rounded-2xl transition-all duration-300 text-white font-bold"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #c084fc)",
                  boxShadow: "0 0 40px rgba(124,58,237,0.4)",
                  minWidth: "200px",
                }}
              >
                <Smartphone className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] font-normal opacity-80">Download on the</div>
                  <div className="text-base font-black leading-tight">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-7 py-4 rounded-2xl transition-all duration-300 text-white font-bold"
                style={{
                  background: "rgba(45,31,78,0.8)",
                  border: "1px solid rgba(192,132,252,0.3)",
                  minWidth: "200px",
                }}
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] font-normal opacity-80">Get it on</div>
                  <div className="text-base font-black leading-tight">Google Play</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-7 py-4 rounded-2xl transition-all duration-300 text-white font-bold"
                style={{
                  background: "rgba(45,31,78,0.8)",
                  border: "1px solid rgba(192,132,252,0.3)",
                  minWidth: "200px",
                }}
              >
                <Tablet className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] font-normal opacity-80">Download for</div>
                  <div className="text-base font-black leading-tight">iPad Pro</div>
                </div>
              </a>
            </div>

            <p className="text-xs" style={{ color: "#9d7fd4" }}>
              Available on iOS 14+ · Android 8+ · iPadOS 14+
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
