import { ArrowRight, TrendingUp, TrendingDown, Calendar, BarChart2 } from "lucide-react";
import { Link } from "wouter";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const calendarItems = [
  { date: "Mar 28", event: "US GDP Growth Q4", impact: "High", country: "🇺🇸", actual: "2.3%", previus: "2.1%" },
  { date: "Mar 30", event: "BI Rate Decision", impact: "High", country: "🇮🇩", actual: "6.00%", previus: "6.00%" },
  { date: "Apr 2", event: "Nonfarm Payrolls", impact: "High", country: "🇺🇸", actual: "—", previus: "275K" },
  { date: "Apr 4", event: "Indonesia CPI", impact: "Med", country: "🇮🇩", actual: "—", previus: "2.51%" },
  { date: "Apr 10", event: "World Bank Indo Outlook", impact: "Med", country: "🌏", actual: "—", previus: "—" },
];

const jciSpark = [
  { t: "Jan", v: 7050 },
  { t: "Feb", v: 7120 },
  { t: "Mar 1", v: 6980 },
  { t: "Mar 8", v: 7180 },
  { t: "Mar 15", v: 7200 },
  { t: "Mar 22", v: 7214 },
];

const marketItems = [
  { label: "JCI (IHSG)", value: "7,214", change: "+1.14%", positive: true },
  { label: "IDR/USD", value: "15,890", change: "+0.32%", positive: false },
  { label: "BI Rate", value: "6.00%", change: "Unchanged", positive: null },
  { label: "US 10Y Yield", value: "4.28%", change: "-0.05%", positive: true },
  { label: "Brent Crude", value: "$82.4", change: "+0.78%", positive: true },
  { label: "Gold", value: "$2,285", change: "+0.63%", positive: true },
];

function SparkTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a3a5c] text-white text-[11px] px-2 py-1 font-semibold">
      {payload[0].value.toLocaleString()}
    </div>
  );
}

export default function DataHub() {
  return (
    <section className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-semibold text-gray-900">Data Hub Snapshot</h2>
            <p className="text-[13px] text-gray-400 mt-0.5">Live market data and upcoming economic releases</p>
          </div>
          <Link href="/data" className="flex items-center gap-1 text-[12.5px] font-medium text-[#1a3a5c] hover:underline">
            Explore full Data Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Economic Calendar — wider */}
          <div className="md:col-span-3 border border-[#E5E7EB] bg-white">
            <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-[13.5px] font-semibold text-gray-900">Economic Calendar</span>
              <span className="ml-auto text-[11px] text-gray-400">Apr 2026</span>
              <Link href="/data/economic-calendar" className="text-[11.5px] text-[#1a3a5c] font-medium hover:underline ml-2">
                See all →
              </Link>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[10.5px] uppercase tracking-wide text-gray-400 border-b border-[#F3F4F6]">
                  <th className="text-left px-4 py-2 font-semibold">Date</th>
                  <th className="text-left py-2 font-semibold">Event</th>
                  <th className="text-right px-4 py-2 font-semibold">Actual</th>
                  <th className="text-right px-4 py-2 font-semibold">Prev</th>
                  <th className="text-right px-4 py-2 font-semibold">Impact</th>
                </tr>
              </thead>
              <tbody>
                {calendarItems.map((item, i) => (
                  <tr key={i} className="border-b border-[#F3F4F6] hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-medium text-gray-500">{item.country} {item.date}</span>
                    </td>
                    <td className="py-3 pr-2">
                      <span className="text-[12.5px] text-gray-800 font-medium">{item.event}</span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <span className={`text-[12px] font-semibold ${item.actual === "—" ? "text-gray-300" : "text-gray-900"}`}>
                        {item.actual}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <span className="text-[11.5px] text-gray-400">{item.previus}</span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 inline-block ${
                          item.impact === "High" ? "text-red-600 bg-red-50" : "text-yellow-700 bg-yellow-50"
                        }`}
                      >
                        {item.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="md:col-span-2 border border-[#E5E7EB] bg-white flex flex-col">
            <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-gray-400" />
              <span className="text-[13.5px] font-semibold text-gray-900">Market Overview</span>
              <Link href="/data/market-dashboard" className="text-[11.5px] text-[#1a3a5c] font-medium hover:underline ml-auto">
                Live →
              </Link>
            </div>

            {/* JCI mini chart */}
            <div className="px-4 pt-3 pb-2 border-b border-[#F3F4F6]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-400">JCI (IHSG) — 1 Month</span>
                <span className="text-[11px] font-semibold text-green-600">▲ +1.14%</span>
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={jciSpark} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <Line type="monotone" dataKey="v" stroke="#1a3a5c" strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: "#1a3a5c" }} />
                  <XAxis dataKey="t" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip content={<SparkTooltip />} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Market items */}
            <div className="divide-y divide-[#F3F4F6] flex-1">
              {marketItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <span className="text-[12.5px] text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-gray-900">{item.value}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        item.positive === null ? "text-gray-400" : item.positive ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {item.positive === true && "▲ "}{item.positive === false && "▼ "}{item.change}
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
