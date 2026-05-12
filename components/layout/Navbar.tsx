"use client";

import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = ["Work", "Services", "About", "Blog"];

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
        background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(168,85,247,0.12)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)" }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Lumina</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#888899" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888899")}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="text-sm font-medium px-5 py-2 rounded-full btn-primary text-white"
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
          >
            Get in touch
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-6 py-6 flex flex-col gap-4"
          style={{
            background: "rgba(10,10,15,0.98)",
            borderColor: "rgba(168,85,247,0.15)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-base font-medium text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-2 text-center text-sm font-medium px-5 py-3 rounded-full text-white"
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
          >
            Get in touch
          </a>
        </div>
      )}
    </header>
  );
}
