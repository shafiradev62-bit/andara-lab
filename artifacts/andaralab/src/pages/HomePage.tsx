import Hero from "@/components/Hero";
import FeaturedInsights from "@/components/FeaturedInsights";
import LatestInsights from "@/components/LatestInsights";
import ResearchAreas from "@/components/ResearchAreas";
import DataHub from "@/components/DataHub";
import AboutSection from "@/components/AboutSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedInsights />
      <LatestInsights />
      <ResearchAreas />
      <DataHub />
      <AboutSection />
    </>
  );
}
