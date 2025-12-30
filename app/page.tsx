import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}