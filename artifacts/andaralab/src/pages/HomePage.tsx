import Hero from "@/components/Hero";
import KeyMetrics from "@/components/KeyMetrics";
import FeaturedInsights from "@/components/FeaturedInsights";
import LatestInsights from "@/components/LatestInsights";
import ResearchAreas from "@/components/ResearchAreas";
import DataHub from "@/components/DataHub";
import AboutSection from "@/components/AboutSection";
import NewsletterSection from "@/components/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <KeyMetrics />
      <FeaturedInsights />
      <LatestInsights />
      <ResearchAreas />
      <DataHub />
      <AboutSection />
      <NewsletterSection />
    </>
  );
}
