import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/HeroSection";
import CardsShowcase from "@/components/features/CardsShowcase";
import FeaturesSection from "@/components/features/FeaturesSection";
import RaritySection from "@/components/features/RaritySection";
import CtaSection from "@/components/features/CtaSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#0e0818" }}>
      <Navbar />
      <HeroSection />
      <CardsShowcase />
      <FeaturesSection />
      <RaritySection />
      <CtaSection />
      <Footer />
    </main>
  );
}
