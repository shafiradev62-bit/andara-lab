import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";

const calendarItems = [
  { date: "Mar 28", event: "US GDP Growth Q4", impact: "High", country: "🇺🇸", actual: "2.3%" },
  { date: "Mar 30", event: "BI Rate Decision", impact: "High", country: "🇮🇩", actual: "6.00%" },
  { date: "Apr 2", event: "Nonfarm Payrolls", impact: "High", country: "🇺🇸", actual: "—" },
  { date: "Apr 4", event: "Indonesia CPI", impact: "Med", country: "🇮🇩", actual: "—" },
];

const marketItems = [
  { label: "IDR/USD", value: "15,890", change: "+0.32%", positive: false },
  { label: "JCI (IHSG)", value: "7,214", change: "+1.14%", positive: true },
  { label: "BI Rate", value: "6.00%", change: "Unchanged", positive: true },
  { label: "US 10Y Yield", value: "4.28%", change: "-0.05%", positive: true },
];

export default function DataHub() {
  return (
    <section className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-semibold text-gray-900">Data Hub Snapshot</h2>
          <Link href="/data" className="flex items-center gap-1 text-[12.5px] font-medium text-[#1a3a5c] hover:underline">
            View all data <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Economic Calendar */}
          <div className="border border-[#E5E7EB]">
            <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-gray-900">Economic Calendar</span>
              <Link href="/data/economic-calendar" className="text-[11.5px] text-[#1a3a5c] font-medium hover:underline">
                View all →
              </Link>
            </div>
            {calendarItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center px-4 py-3 ${i < calendarItems.length - 1 ? "border-b border-[#F3F4F6]" : ""}`}
              >
                <span className="text-[12px] font-medium text-gray-400 w-14 flex-shrink-0">{item.date}</span>
                <span className="text-[12.5px] text-gray-800 flex-1">{item.event}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-700">{item.actual}</span>
                  <span
                    className={`text-[10.5px] font-semibold px-1.5 py-0.5 ${
                      item.impact === "High" ? "text-red-600 bg-red-50" : "text-yellow-700 bg-yellow-50"
                    }`}
                  >
                    {item.impact}
                  </span>
                  <span className="text-[13px]">{item.country}</span>
                </div>
              </div>
            ))}
            <div className="px-4 py-3 border-t border-[#E5E7EB]">
              <Link
                href="/data/economic-calendar"
                className="flex items-center gap-1.5 justify-center text-[12.5px] font-medium text-white bg-[#1a3a5c] px-5 py-2 w-full hover:bg-[#14305a] transition-colors"
              >
                Full Economic Calendar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Market Overview */}
          <div className="border border-[#E5E7EB]">
            <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-gray-900">Market Overview</span>
              <Link href="/data/market-dashboard" className="text-[11.5px] text-[#1a3a5c] font-medium hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[#F3F4F6]">
              {marketItems.map((item, i) => (
                <div key={i} className={`p-4 ${i < 2 ? "border-b border-[#F3F4F6]" : ""}`}>
                  <div className="text-[11px] text-gray-400 mb-1">{item.label}</div>
                  <div className="text-[20px] font-bold text-gray-900 leading-none mb-1">{item.value}</div>
                  <div className="flex items-center gap-1">
                    {item.positive ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-[11.5px] font-semibold ${item.positive ? "text-green-600" : "text-red-500"}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[#E5E7EB]">
              <Link
                href="/data/market-dashboard"
                className="flex items-center gap-1.5 justify-center text-[12.5px] font-medium text-white bg-[#1a3a5c] px-5 py-2 w-full hover:bg-[#14305a] transition-colors"
              >
                Market Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
