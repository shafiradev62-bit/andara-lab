import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedInsights from "@/components/FeaturedInsights";
import LatestInsights from "@/components/LatestInsights";
import ResearchAreas from "@/components/ResearchAreas";
import DataHub from "@/components/DataHub";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />
      <main>
        <Hero />
        <FeaturedInsights />
        <LatestInsights />
        <ResearchAreas />
        <DataHub />
        <AboutSection />
        <Footer />
      </main>
    </div>
  );
}
