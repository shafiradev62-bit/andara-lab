import { useEffect } from "react";
import Hero from "@/components/Hero";
import KeyMetrics from "@/components/KeyMetrics";
import FeaturedInsights from "@/components/FeaturedInsights";
import LatestInsights from "@/components/LatestInsights";
import ResearchAreas from "@/components/ResearchAreas";
import DataHub from "@/components/DataHub";
import AboutSection from "@/components/AboutSection";
import NewsletterSection from "@/components/NewsletterSection";
import { useLocale } from "@/lib/locale";
import { applyDocumentSeo, SITE_NAME } from "@/lib/document-meta";

export default function HomePage() {
  const { t } = useLocale();

  useEffect(() => {
    applyDocumentSeo({
      title: SITE_NAME,
      description: t("meta_site_description"),
      pathname: "/",
    });
  }, [t]);

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
