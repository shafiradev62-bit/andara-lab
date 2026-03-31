import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const gdpData = [
  { q: "Q1'22", v: 5.01 },
  { q: "Q2'22", v: 5.44 },
  { q: "Q3'22", v: 5.72 },
  { q: "Q4'22", v: 5.01 },
  { q: "Q1'23", v: 5.03 },
  { q: "Q2'23", v: 5.17 },
  { q: "Q3'23", v: 4.94 },
  { q: "Q4'23", v: 5.04 },
  { q: "Q1'24", v: 5.11 },
  { q: "Q2'24", v: 5.05 },
  { q: "Q3'24", v: 4.95 },
  { q: "Q4'24", v: 5.02 },
];

function HeroTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E7EB] shadow-sm px-3 py-2">
      <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-[14px] font-bold text-gray-900">{payload[0].value}%</p>
    </div>
  );
}

const highlights = [
  { label: "GDP Growth", value: "5.02%", dir: "up" },
  { label: "BI Rate", value: "6.00%", dir: "flat" },
  { label: "Inflation", value: "2.51%", dir: "down" },
];

export default function Hero() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left column */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
              PT. Andara Investasi Cerdas · Economic Research
            </div>
            <h1 className="text-[38px] md:text-[50px] font-bold text-gray-900 leading-[1.08] mb-5">
              Decoding Economies,<br />
              Empowering Growth
            </h1>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[420px]">
              AndaraLab transforms Indonesia's complex economic data into
              high-precision strategic intelligence — from macro policy to
              sectoral deep-dives.
            </p>

            {/* Highlights strip */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#F3F4F6]">
              {highlights.map((h) => (
                <div key={h.label} className="border-l-2 border-[#1a3a5c] pl-3">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{h.label}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[17px] font-bold text-gray-900">{h.value}</span>
                    <span className={`text-[11px] font-semibold ${h.dir === "flat" ? "text-gray-400" : "text-green-600"}`}>
                      {h.dir === "up" ? "▲" : h.dir === "down" ? "▼" : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/macro/macro-outlooks"
                className="inline-flex items-center gap-2 text-white text-[13px] font-semibold bg-[#1a3a5c] px-5 py-2.5 hover:bg-[#14305a] transition-colors"
              >
                Explore Research
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/data"
                className="inline-flex items-center gap-2 border border-[#D1D5DB] text-gray-700 text-[13px] font-medium px-5 py-2.5 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                Data Hub
              </Link>
            </div>
          </div>

          {/* Right column: chart card */}
          <div className="hidden md:block">
            <div className="border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="text-[13px] font-semibold text-gray-900">Indonesia GDP Growth</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Year-over-year, quarterly (%)</div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-bold text-gray-900">5.02%</div>
                  <div className="text-[11px] text-green-600 font-semibold">▲ Q4 2024</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={168}>
                <AreaChart data={gdpData} margin={{ top: 8, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a3a5c" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1a3a5c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="q"
                    tick={{ fontSize: 9, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[4.5, 6]}
                    tick={{ fontSize: 9, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<HeroTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#1a3a5c"
                    strokeWidth={2}
                    fill="url(#heroGrad)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: "#1a3a5c" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F3F4F6]">
                <span className="text-[11px] text-gray-400">Source: BPS Indonesia · AndaraLab</span>
                <Link href="/data" className="text-[11px] text-[#1a3a5c] font-semibold hover:underline flex items-center gap-1">
                  Full Data Hub <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
