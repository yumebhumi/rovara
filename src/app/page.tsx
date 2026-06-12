import { Navbar, Footer } from "@/components/layout";
import { HeroSection, Features, HowItWorks, AIShowcase, Testimonials, CTASection } from "@/components/landing";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <AIShowcase />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
