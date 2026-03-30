import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { loadDatasets, ChartDataset } from "@/lib/cms-store";
import InteractiveChart from "@/components/InteractiveChart";
import { BarChart2, LineChart as LineChartIcon, TrendingUp, Calendar, Table as TableIcon, ArrowRight, ExternalLink } from "lucide-react";

const calendarItems = [
  { date: "Mar 28", event: "GDP Growth Q4", impact: "High", country: "🇺🇸", actual: "2.3%", forecast: "2.1%" },
  { date: "Mar 30", event: "BI Rate Decision", impact: "High", country: "🇮🇩", actual: "6.00%", forecast: "6.00%" },
  { date: "Apr 2", event: "Nonfarm Payrolls", impact: "High", country: "🇺🇸", actual: "—", forecast: "185K" },
  { date: "Apr 4", event: "CPI Indonesia", impact: "Med", country: "🇮🇩", actual: "—", forecast: "2.5%" },
  { date: "Apr 7", event: "US Unemployment", impact: "High", country: "🇺🇸", actual: "—", forecast: "4.1%" },
  { date: "Apr 10", event: "China CPI", impact: "Med", country: "🇨🇳", actual: "—", forecast: "0.4%" },
  { date: "Apr 14", event: "US CPI (Mar)", impact: "High", country: "🇺🇸", actual: "—", forecast: "3.1%" },
];

const marketCards = [
  { label: "IDR/USD", value: "15,890", change: "+0.32%", positive: false, sub: "vs yesterday" },
  { label: "JCI (IHSG)", value: "7,214", change: "+1.14%", positive: true, sub: "pts" },
  { label: "BI Rate", value: "6.00%", change: "0.00%", positive: true, sub: "unchanged" },
  { label: "US 10Y Yield", value: "4.28%", change: "-0.05%", positive: true, sub: "bps" },
  { label: "Brent Crude", value: "$82.4", change: "+0.8%", positive: true, sub: "per barrel" },
  { label: "Gold", value: "$2,285", change: "+0.6%", positive: true, sub: "per oz" },
];

export default function DataHubPage() {
  const [location] = useLocation();
  const [datasets, setDatasets] = useState<ChartDataset[]>([]);
  const [activeTab, setActiveTab] = useState<"charts" | "calendar" | "market">("charts");
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"chart" | "table">("chart");

  const isCalendar = location.includes("economic-calendar");
  const isDashboard = location.includes("market-dashboard");

  useEffect(() => {
    setDatasets(loadDatasets());
    if (isCalendar) setActiveTab("calendar");
    else if (isDashboard) setActiveTab("market");
    else setActiveTab("charts");
  }, [isCalendar, isDashboard]);

  const selectedDataset = selectedChart ? datasets.find((d) => d.id === selectedChart) : null;

  return (
    <div className="bg-white">
      <section className="border-b border-[#E5E7EB] py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#1a3a5c] mb-3">Data Hub</div>
          <h1 className="text-[34px] font-bold text-gray-900 mb-3">Economic Data & Market Intelligence</h1>
          <p className="text-[14.5px] text-gray-500 max-w-[540px]">
            Interactive charts, economic calendar, and live market data for Indonesia and global economies.
          </p>
        </div>
      </section>

      {/* Tab Nav */}
      <div className="border-b border-[#E5E7EB] bg-white sticky top-14 z-30">
        <div className="max-w-[1200px] mx-auto px-6 flex gap-0">
          {[
            { key: "charts", label: "Interactive Charts", icon: BarChart2 },
            { key: "calendar", label: "Economic Calendar", icon: Calendar },
            { key: "market", label: "Market Overview", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-[13px] font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#1a3a5c] text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Tab */}
      {activeTab === "charts" && (
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          {!selectedChart ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold text-gray-900">Available Datasets</h2>
                <Link href="/admin" className="text-[12.5px] font-medium text-[#1a3a5c] flex items-center gap-1 hover:underline">
                  Manage in CMS <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {datasets.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => setSelectedChart(ds.id)}
                    className="border border-[#E5E7EB] p-5 text-left hover:border-[#1a3a5c] hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10.5px] font-semibold uppercase tracking-widest text-[#1a3a5c] bg-blue-50 px-2 py-0.5">
                        {ds.category}
                      </span>
                      <span className="text-[11px] text-gray-400 capitalize">{ds.chartType}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1.5 group-hover:text-[#1a3a5c] transition-colors">
                      {ds.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">{ds.description}</p>
                    <div className="h-[100px] pointer-events-none">
                      <InteractiveChart dataset={ds} height={100} />
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[12px] text-[#1a3a5c] font-medium">
                      View full chart <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : selectedDataset ? (
            <div>
              <button
                onClick={() => setSelectedChart(null)}
                className="flex items-center gap-1.5 text-[12.5px] text-gray-500 hover:text-gray-900 mb-6 font-medium"
              >
                ← Back to all charts
              </button>
              <div className="border border-[#E5E7EB] p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10.5px] font-semibold uppercase tracking-widest text-[#1a3a5c] bg-blue-50 px-2 py-0.5 mb-3 inline-block">
                      {selectedDataset.category}
                    </span>
                    <h2 className="text-[22px] font-semibold text-gray-900 mt-2">{selectedDataset.title}</h2>
                    <p className="text-[13px] text-gray-500 mt-1">{selectedDataset.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveView("chart")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] border transition-colors ${activeView === "chart" ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-[#E5E7EB] text-gray-600 hover:border-gray-400"}`}
                    >
                      <LineChartIcon className="w-3.5 h-3.5" /> Chart
                    </button>
                    <button
                      onClick={() => setActiveView("table")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] border transition-colors ${activeView === "table" ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-[#E5E7EB] text-gray-600 hover:border-gray-400"}`}
                    >
                      <TableIcon className="w-3.5 h-3.5" /> Table
                    </button>
                  </div>
                </div>
                <div className="h-px bg-[#E5E7EB] my-5" />
                {activeView === "chart" ? (
                  <InteractiveChart dataset={selectedDataset} height={360} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-[#E5E7EB]">
                          {selectedDataset.columns.map((col) => (
                            <th key={col} className="text-left py-2.5 px-3 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDataset.rows.map((row, i) => (
                          <tr key={i} className="border-b border-[#F3F4F6] hover:bg-gray-50">
                            {selectedDataset.columns.map((col) => (
                              <td key={col} className="py-2.5 px-3 text-gray-700">
                                {row[col] ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-[11px] text-gray-400 mt-4">
                  Unit: {selectedDataset.unit} · Updated: {selectedDataset.updatedAt}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-6">Economic Calendar — April 2026</h2>
          <div className="border border-[#E5E7EB]">
            <div className="grid grid-cols-5 border-b border-[#E5E7EB] bg-gray-50 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5">
              <div>Date</div><div>Event</div><div>Impact</div><div>Actual</div><div>Forecast</div>
            </div>
            {calendarItems.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-5 px-4 py-3.5 items-center ${i < calendarItems.length - 1 ? "border-b border-[#F3F4F6]" : ""} hover:bg-gray-50`}
              >
                <div className="text-[13px] font-semibold text-gray-700">
                  {item.date} {item.country}
                </div>
                <div className="text-[13px] text-gray-800">{item.event}</div>
                <div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 ${
                    item.impact === "High" ? "text-red-600 bg-red-50" : "text-yellow-700 bg-yellow-50"
                  }`}>
                    {item.impact}
                  </span>
                </div>
                <div className="text-[13px] font-semibold text-gray-900">{item.actual}</div>
                <div className="text-[13px] text-gray-500">{item.forecast}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Tab */}
      {activeTab === "market" && (
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-6">Market Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {marketCards.map((card) => (
              <div key={card.label} className="border border-[#E5E7EB] p-5">
                <div className="text-[11.5px] text-gray-400 mb-1.5">{card.label}</div>
                <div className="text-[24px] font-bold text-gray-900 mb-1">{card.value}</div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[12px] font-semibold ${card.positive ? "text-green-600" : "text-red-500"}`}>
                    {card.positive ? "▲" : "▼"} {card.change}
                  </span>
                  <span className="text-[11px] text-gray-400">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-[16px] font-semibold text-gray-900 mb-5">Featured Charts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {datasets.slice(0, 4).map((ds) => (
              <div key={ds.id} className="border border-[#E5E7EB] p-5">
                <h4 className="text-[14px] font-semibold text-gray-900 mb-1">{ds.title}</h4>
                <p className="text-[12px] text-gray-400 mb-4">{ds.description}</p>
                <InteractiveChart dataset={ds} height={200} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
