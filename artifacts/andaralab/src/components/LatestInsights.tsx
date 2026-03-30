import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const topThree = [
  {
    category: "Macro Outlooks",
    date: "March 26, 2026",
    title: "Emerging Market Currency Volatility: How IDR Is Faring",
    description: "The IDR has appreciated 2.1% against the USD over the past month as BI signals a hold. We examine the carry trade dynamics at play.",
    href: "/macro/macro-outlooks",
    featured: true,
  },
  {
    category: "Geopolitical",
    date: "March 22, 2026",
    title: "US-China Trade Tensions: Impact on Indonesian Exports",
    description: "Indonesia's commodity exports remain resilient, but manufacturing faces tariff displacement risk as trade war escalates.",
    href: "/macro/geopolitical",
    featured: false,
  },
  {
    category: "ESG",
    date: "March 19, 2026",
    title: "Renewable Energy Investment: Indonesia's Green Bond Push",
    description: "Green bonds grew 45% in 2025. We assess credibility gaps and where the real capital is flowing.",
    href: "/sectoral/esg",
    featured: false,
  },
];

const listItems = [
  {
    category: "Sectoral Intelligence",
    date: "March 24, 2026",
    title: "Palm Oil Sector: Pricing Dynamics & European ESG Headwinds",
    href: "/sectoral/deep-dives",
  },
  {
    category: "Regional Monitor",
    date: "March 20, 2026",
    title: "Java Economic Corridor: Growth Concentration & Disparity Analysis",
    href: "/sectoral/regional",
  },
  {
    category: "Market Pulse",
    date: "March 17, 2026",
    title: "JCI Hits 7,200 on BI Hold — What Equity Investors Should Watch",
    href: "/blog/market-pulse",
  },
];

export default function LatestInsights() {
  return (
    <section className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] font-semibold text-gray-900">Latest Insights</h2>
          <Link href="/blog/market-pulse" className="text-[12.5px] font-medium text-[#1a3a5c] hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-3">
          {topThree.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              className={`p-5 flex flex-col hover:bg-gray-50 transition-colors ${
                i < 2 ? "border-b md:border-b-0 md:border-r border-[#E5E7EB]" : ""
              }`}
            >
              <div className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-wide font-medium">
                {item.category} — {item.date}
              </div>
              <h3 className={`font-semibold text-gray-900 leading-snug mb-2 hover:text-[#1a3a5c] ${item.featured ? "text-[16px]" : "text-[14px]"}`}>
                {item.title}
              </h3>
              <p className="text-[12.5px] text-gray-500 leading-relaxed flex-1 mb-3">
                {item.description}
              </p>
              <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-gray-700 hover:text-[#1a3a5c] transition-colors">
                Read More
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
        <div className="border-l border-r border-b border-[#E5E7EB]">
          {listItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block px-5 py-4 border-t border-[#E5E7EB] hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-[11.5px] font-semibold text-gray-700 mb-0.5">
                    {item.category}{" "}
                    <span className="font-normal text-gray-400">— {item.date}</span>
                  </div>
                  <div className="text-[13px] font-medium text-gray-900 leading-snug mt-1">
                    {item.title}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-500 hover:text-gray-900 flex-shrink-0 mt-1">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
