"use client";

import { useState, useEffect } from "react";
import { Smartphone, Tablet, Menu, X } from "lucide-react";

const navLinks = ["Collection", "Battle", "Lore", "Leaderboard", "Shop"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(14,8,24,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(192,132,252,0.12)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)" }}
            />
            <span className="relative text-white font-black text-sm tracking-widest">K</span>
          </div>
          <span
            className="font-black text-xl tracking-[0.15em] uppercase"
            style={{ background: "linear-gradient(135deg, #e9d5ff, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            Kwtor
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link text-sm font-medium tracking-wide">
              {link}
            </a>
          ))}
        </nav>

        {/* Platform buttons */}
        <div className="hidden md:flex items-center gap-2">
          {[
            { icon: Smartphone, label: "iPhone" },
            { icon: Smartphone, label: "Android" },
            { icon: Tablet, label: "iPad Pro" },
          ].map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              className="platform-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ color: "#c084fc" }}
            >
              <Icon className="w-3 h-3" />
              {label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg"
          style={{ color: "#c084fc" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t px-6 py-6 flex flex-col gap-4"
          style={{ background: "rgba(14,8,24,0.98)", borderColor: "rgba(192,132,252,0.15)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium"
              style={{ color: "#9d7fd4" }}
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <div className="flex gap-2 mt-2">
            {["iPhone", "Android", "iPad Pro"].map((p) => (
              <a
                key={p}
                href="#"
                className="platform-btn px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ color: "#c084fc" }}
              >
                {p}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
