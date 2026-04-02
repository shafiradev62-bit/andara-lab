import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useDatasets } from "@/lib/cms-store";
import { useLocale } from "@/lib/locale";
import { applyDocumentSeo } from "@/lib/document-meta";
import InteractiveChart from "@/components/InteractiveChart";
import { BarChart2, LineChart as LineChartIcon, TrendingUp, Calendar, Table as TableIcon, ArrowRight, ExternalLink, AlertCircle, Loader2 } from "lucide-react";

function getLastTwo(rows: Record<string, string | number>[], key: string) {
  const vals = rows.map((r) => {
    const v = r[key];
    return typeof v === "number" ? v : parseFloat(String(v));
  }).filter((v) => !isNaN(v));
  const last = vals[vals.length - 1] ?? 0;
  const prev = vals.length > 1 ? vals[vals.length - 2] : last;
  return { last, prev };
}

function fmtChange(last: number, prev: number): { label: string; positive: boolean | null } {
  const diff = last - prev;
  if (Math.abs(diff) < 0.001) return { label: "Unchanged", positive: null };
  return { label: `${diff > 0 ? "+" : ""}${diff.toFixed(2)}`, positive: diff > 0 };
}

export default function DataHubPage() {
  const [location] = useLocation();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<"charts" | "calendar" | "market">("charts");
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"chart" | "table">("chart");

  const { data: datasets = [], isLoading, error } = useDatasets();

  useEffect(() => {
    const path =
      location && location !== "/" ? (location.startsWith("/") ? location : `/${location}`) : "/data";
    applyDocumentSeo({
      title: t("data_hub_title"),
      description: t("meta_data_description"),
      pathname: path,
    });
  }, [location, t]);

  const isCalendar = location.includes("economic-calendar");
  const isDashboard = location.includes("market-dashboard");

  // Sync tab from URL on mount/route change
  if (isCalendar && activeTab !== "calendar") setActiveTab("calendar");
  else if (isDashboard && activeTab !== "market") setActiveTab("market");
  else if (!isCalendar && !isDashboard && activeTab !== "charts") setActiveTab("charts");

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

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-[13.5px]">Loading datasets…</span>
                </div>
              )}

              {/* Error state — fallback to localStorage */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-red-700">Could not reach API server</p>
                    <p className="text-[12px] text-red-500 mt-0.5">
                      Showing cached data. Start the API server: <code className="bg-red-100 px-1 rounded">pnpm --filter api-server dev</code>
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && (
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
                  {datasets.length === 0 && !error && (
                    <div className="col-span-full text-center py-16 text-gray-400">
                      <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-[14px]">No datasets available.</p>
                      <Link href="/admin" className="text-[13px] text-[#1a3a5c] hover:underline mt-1 inline-block">
                        Add one in the CMS →
                      </Link>
                    </div>
                  )}
                </div>
              )}
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
          <h2 className="text-[18px] font-semibold text-gray-900 mb-2">Economic Calendar</h2>
          <p className="text-[13px] text-gray-400 mb-6">
            Economic calendar data can be managed via the CMS.{" "}
            <Link href="/admin" className="text-[#1a3a5c] hover:underline">Open Admin →</Link>
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[13.5px]">Loading…</span>
            </div>
          ) : (
            <div className="border border-[#E5E7EB]">
              <div className="grid grid-cols-4 border-b border-[#E5E7EB] bg-gray-50 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5">
                <div>Dataset</div><div>Category</div><div>Last Updated</div><div>Unit</div>
              </div>
              {datasets.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-400 text-[13px]">
                  No datasets available. <Link href="/admin" className="text-[#1a3a5c] hover:underline">Add in CMS →</Link>
                </div>
              )}
              {datasets.map((ds, i) => (
                <div
                  key={ds.id}
                  className={`grid grid-cols-4 px-4 py-3.5 items-center ${i < datasets.length - 1 ? "border-b border-[#F3F4F6]" : ""} hover:bg-gray-50 cursor-pointer`}
                  onClick={() => { setSelectedChart(ds.id); setActiveTab("charts"); }}
                >
                  <div className="text-[13px] font-semibold text-gray-800">{ds.title}</div>
                  <div className="text-[12.5px] text-gray-500">{ds.category}</div>
                  <div className="text-[12px] text-gray-400">{ds.updatedAt?.slice(0, 10) ?? "—"}</div>
                  <div className="text-[12px] text-gray-500">{ds.unit}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Market Tab */}
      {activeTab === "market" && (
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-6">Market Overview</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[13.5px]">Loading…</span>
            </div>
          ) : (
            <>
              {/* Market cards from CMS datasets */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {datasets
                  .filter((ds) => ["bi-rate", "idr-usd", "trade-balance", "gdp-growth", "inflation-rate", "sovereign-bond-yield"].includes(ds.id))
                  .map((ds) => {
                    const valueKey = ds.columns[1];
                    const { last, prev } = getLastTwo(ds.rows, valueKey);
                    const { label, positive } = fmtChange(last, prev);
                    const lastRow = ds.rows[ds.rows.length - 1];
                    const periodKey = ds.columns[0];
                    return (
                      <div
                        key={ds.id}
                        className="border border-[#E5E7EB] p-5 cursor-pointer hover:border-[#1a3a5c] transition-colors"
                        onClick={() => { setSelectedChart(ds.id); setActiveTab("charts"); }}
                      >
                        <div className="text-[11.5px] text-gray-400 mb-1.5">{ds.title}</div>
                        <div className="text-[24px] font-bold text-gray-900 mb-1">
                          {last.toLocaleString()}{ds.unit === "%" ? "%" : ""}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[12px] font-semibold ${positive === null ? "text-gray-400" : positive ? "text-green-600" : "text-red-500"}`}>
                            {positive === true && "▲ "}{positive === false && "▼ "}{label}
                          </span>
                          <span className="text-[11px] text-gray-400">{String(lastRow?.[periodKey] ?? "")}</span>
                        </div>
                      </div>
                    );
                  })}
                {datasets.filter((ds) => ["bi-rate", "idr-usd", "trade-balance", "gdp-growth", "inflation-rate", "sovereign-bond-yield"].includes(ds.id)).length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400 text-[13px]">
                    No market datasets found. <Link href="/admin" className="text-[#1a3a5c] hover:underline">Add in CMS →</Link>
                  </div>
                )}
              </div>
              <h3 className="text-[16px] font-semibold text-gray-900 mb-5">All Datasets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {datasets.map((ds) => (
                  <div
                    key={ds.id}
                    className="border border-[#E5E7EB] p-5 cursor-pointer hover:border-[#1a3a5c] transition-colors"
                    onClick={() => { setSelectedChart(ds.id); setActiveTab("charts"); }}
                  >
                    <h4 className="text-[14px] font-semibold text-gray-900 mb-1">{ds.title}</h4>
                    <p className="text-[12px] text-gray-400 mb-4">{ds.description}</p>
                    <InteractiveChart dataset={ds} height={200} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
