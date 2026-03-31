const tickers = [
  { symbol: "IDR/USD", value: "15,890", change: "+0.32%", up: false },
  { symbol: "JCI", value: "7,214.3", change: "+1.14%", up: true },
  { symbol: "BI Rate", value: "6.00%", change: "Unch", up: true },
  { symbol: "US 10Y", value: "4.28%", change: "-0.05%", up: true },
  { symbol: "Gold", value: "$2,285", change: "+0.63%", up: true },
  { symbol: "Brent", value: "$82.4", change: "+0.78%", up: true },
  { symbol: "EUR/USD", value: "1.0831", change: "-0.15%", up: false },
  { symbol: "DXY", value: "104.2", change: "+0.18%", up: false },
  { symbol: "S&P 500", value: "5,248", change: "+0.52%", up: true },
  { symbol: "Shanghai", value: "3,178", change: "-0.24%", up: false },
  { symbol: "Nikkei", value: "38,820", change: "+0.87%", up: true },
  { symbol: "CPI ID", value: "2.51%", change: "-0.33pp", up: true },
];

const double = [...tickers, ...tickers];

export default function MarketTicker() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
  });

  return (
    <div className="bg-[#0f2540] border-b border-white/10 overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 flex items-center gap-2 px-3 border-r border-white/15 h-full bg-[#0f2540] z-10">
        <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
        <span className="text-[10.5px] font-semibold text-white/50 uppercase tracking-widest">Live</span>
        <span className="text-[10.5px] text-white/30 ml-1">WIB {timeStr}</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-track">
          {double.map((t, i) => (
            <div key={i} className="flex items-center gap-2 px-5 border-r border-white/10 h-8">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wide whitespace-nowrap">
                {t.symbol}
              </span>
              <span className="text-[11.5px] font-semibold text-white whitespace-nowrap">{t.value}</span>
              <span
                className={`text-[10.5px] font-semibold whitespace-nowrap ${
                  t.change === "Unch" ? "text-white/40" : t.up ? "text-green-400" : "text-red-400"
                }`}
              >
                {t.change === "Unch" ? t.change : (t.up ? "▲" : "▼") + " " + t.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
