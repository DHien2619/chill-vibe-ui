import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/HeroSection";
import ServicesSection from "@/components/features/ServicesSection";
import WorkSection from "@/components/features/WorkSection";
import TestimonialsSection from "@/components/features/TestimonialsSection";
import CtaSection from "@/components/features/CtaSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#0a0a0f" }}>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WorkSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
