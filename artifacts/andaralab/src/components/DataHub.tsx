import { ArrowRight } from "lucide-react";

const calendarItems = [
  {
    date: "Mar 28",
    event: "GDP Growth",
    impact: "High",
    country: "🇺🇸",
  },
  {
    date: "Mar 30",
    event: "BI Rate Decision",
    impact: "ID",
    country: "🇮🇩",
  },
  {
    date: "Apr 2",
    event: "Nonfarm Payrolls",
    impact: "Madar",
    country: "🇺🇸",
  },
];

const marketItems = [
  {
    label: "IDR to USD",
    value: "14,350",
    change: "-0.12%",
    sub: "+0.12%",
    positive: false,
  },
  {
    label: "US 10Y –...",
    value: "Yield",
    change: "",
    sub: "",
    positive: true,
  },
];

export default function DataHub() {
  return (
    <section className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Economic Calendar */}
          <div>
            <h2 className="text-[20px] font-semibold text-gray-900 mb-5">
              Data Hub Snapshot
            </h2>
            <div className="border border-[#E5E7EB]">
              <div className="px-4 py-3 border-b border-[#E5E7EB]">
                <span className="text-[13.5px] font-semibold text-gray-900">
                  Economic Calendar
                </span>
              </div>
              {calendarItems.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center px-4 py-3 ${
                    i < calendarItems.length - 1
                      ? "border-b border-[#E5E7EB]"
                      : ""
                  }`}
                >
                  <span className="text-[12.5px] font-medium text-gray-500 w-16 flex-shrink-0">
                    {item.date}
                  </span>
                  <span className="text-[13px] text-gray-800 flex-1 font-medium">
                    {item.event}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[11.5px] font-semibold px-2 py-0.5 ${
                        item.impact === "High"
                          ? "text-red-600 bg-red-50"
                          : item.impact === "ID"
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {item.impact}
                    </span>
                    <span className="text-[15px]">{item.country}</span>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-[#E5E7EB]">
                <button className="flex items-center gap-1.5 mx-auto text-[12.5px] font-medium text-white bg-[#1a3a5c] px-5 py-2">
                  View Full Calendar
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Market Overview */}
          <div>
            <h2 className="text-[20px] font-semibold text-gray-900 mb-5">
              Market Overview
            </h2>
            <div className="border border-[#E5E7EB]">
              <div className="grid grid-cols-2 divide-x divide-[#E5E7EB] border-b border-[#E5E7EB]">
                {marketItems.map((item, i) => (
                  <div key={i} className="p-4">
                    <div className="text-[11.5px] text-gray-400 mb-1">{item.label}</div>
                    <div className="text-[20px] font-bold text-gray-900 leading-none mb-1">
                      {item.value}
                    </div>
                    {item.change && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[12px] font-semibold ${
                            item.positive ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {item.positive ? "↑" : "↓"}{item.change}
                        </span>
                        <span className="text-[11px] text-gray-400">{item.sub}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* About block inside right column */}
              <div className="p-6 text-center">
                <h3 className="text-[18px] font-semibold text-gray-900 mb-2">
                  About AndaraLab
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4 max-w-[280px] mx-auto">
                  Delivering expert economic research and market insights for
                  informed decision making.
                </p>
                <a
                  href="#about"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white bg-[#1a3a5c] px-5 py-2"
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
