import { ArrowRight, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

const categoryColors: Record<string, string> = {
  "Macro Outlooks": "text-blue-700 bg-blue-50",
  "Geopolitical": "text-purple-700 bg-purple-50",
  "ESG": "text-green-700 bg-green-50",
  "Sectoral Intelligence": "text-orange-700 bg-orange-50",
  "Regional Monitor": "text-teal-700 bg-teal-50",
  "Market Pulse": "text-red-700 bg-red-50",
};

const topThree = [
  {
    category: "Market Pulse",
    date: "Mar 26, 2026",
    readTime: "6 min",
    title: "IDR Currency Dynamics: Carry Trade and What Drives the Exchange Rate",
    description: "The IDR has appreciated 2.1% against the USD over the past month as BI signals a hold. We examine the carry trade dynamics at play and what the 2026 current account deficit means.",
    href: "/article/idr-carry-trade-dynamics",
  },
  {
    category: "Geopolitical",
    date: "Mar 22, 2026",
    readTime: "7 min",
    title: "US-China Trade Tensions: Impact on Indonesian Exports",
    description: "Indonesia's commodity exports remain resilient, but manufacturing faces tariff displacement risk as the trade war escalates into a new phase.",
    href: "/article/us-china-trade-indonesia",
  },
  {
    category: "ESG",
    date: "Mar 25, 2026",
    readTime: "7 min",
    title: "Indonesia's Green Bond Market: Growth & Credibility Challenges",
    description: "Green bonds grew 45% in 2025. We assess credibility gaps and where the real capital is flowing in Indonesia's energy transition.",
    href: "/article/indonesia-green-bond-market",
  },
];

const listItems = [
  {
    category: "Sectoral Intelligence",
    date: "Mar 15, 2026",
    readTime: "7 min",
    title: "Palm Oil Sector: Pricing Dynamics & European ESG Headwinds",
    href: "/article/palm-oil-esg-headwinds",
  },
  {
    category: "Regional Monitor",
    date: "Mar 20, 2026",
    readTime: "8 min",
    title: "Java Economic Corridor: Growth Concentration & Disparity Analysis",
    href: "/article/java-economic-corridor",
  },
  {
    category: "Market Pulse",
    date: "Mar 17, 2026",
    readTime: "4 min",
    title: "JCI Hits 7,200 on BI Hold — What Equity Investors Should Watch",
    href: "/article/jci-7200-bi-hold",
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

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {topThree.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group border border-[#E5E7EB] p-5 flex flex-col hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10.5px] font-semibold px-2 py-0.5 uppercase tracking-wide ${categoryColors[item.category] || "text-gray-600 bg-gray-50"}`}>
                  {item.category}
                </span>
              </div>
              <h3 className="text-[14.5px] font-semibold text-gray-900 leading-snug mb-2.5 group-hover:text-[#1a3a5c] transition-colors flex-1">
                {item.title}
              </h3>
              <p className="text-[12.5px] text-gray-500 leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>{item.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {item.readTime}
                  </span>
                </div>
                <span className="text-[12px] font-medium text-[#1a3a5c] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* List */}
        <div className="border border-[#E5E7EB]">
          {listItems.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group ${i > 0 ? "border-t border-[#F3F4F6]" : ""}`}
            >
              <div className="flex-shrink-0 w-20">
                <span className={`text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide ${categoryColors[item.category] || "text-gray-600 bg-gray-50"}`}>
                  {item.category.split(" ")[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-gray-900 truncate group-hover:text-[#1a3a5c] transition-colors">
                  {item.title}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 text-[11px] text-gray-400">
                <span>{item.date}</span>
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {item.readTime}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1a3a5c] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
