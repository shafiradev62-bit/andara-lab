import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useDatasets } from "@/lib/cms-store";
import { useLocale } from "@/lib/locale";
import { applyDocumentSeo } from "@/lib/document-meta";
import { formatValue } from "@/lib/utils";
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

function fmtChange(last: number, prev: number, unchangedLabel: string = "Unchanged"): { label: string; positive: boolean | null } {
  const diff = last - prev;
  if (Math.abs(diff) < 0.001) return { label: unchangedLabel, positive: null };
  return { label: `${diff > 0 ? "+" : ""}${diff.toFixed(2)}`, positive: diff > 0 };
}

export default function DataHubPage() {
  const [location] = useLocation();
  const { t, locale } = useLocale();
  const [activeTab, setActiveTab] = useState<"charts" | "calendar" | "market">("charts");
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"chart" | "table">("chart");

  const { data: datasets = [], isLoading, error } = useDatasets();

  useEffect(() => {
    const path =
      location && location !== "/" ? (location.startsWith("/") ? location : `/${location}`) : "/data";
    applyDocumentSeo({
      title: t("data_hub"),
      description: t("meta_data_description"),
      pathname: path,
    });
  }, [location, t]);

  const isCalendar = location.includes("economic-calendar");
  const isDashboard = location.includes("market-dashboard");

  // Sync tab from URL on route change
  useEffect(() => {
    if (isCalendar) setActiveTab("calendar");
    else if (isDashboard) setActiveTab("market");
    else setActiveTab("charts");
  }, [isCalendar, isDashboard]);

  const selectedDataset = selectedChart ? datasets.find((d) => d.id === selectedChart) : null;

  return (
    <div className="bg-white">
      <section className="border-b border-[#E5E7EB] py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-900 mb-3">{t("data_hub")}</div>
          <h1 className="text-[34px] font-bold text-gray-900 mb-3">{t("economic_data_market_intelligence")}</h1>
          <p className="text-[14.5px] text-gray-500 max-w-[540px]">
            {t("data_hub_subtitle")}
          </p>
        </div>
      </section>

      {/* Tab Nav */}
      <div className="border-b border-[#E5E7EB] bg-white sticky top-14 z-30">
        <div className="max-w-[1200px] mx-auto px-6 flex gap-0">
          {[
            { key: "charts", label: t("interactive_charts"), icon: BarChart2 },
            { key: "calendar", label: t("economic_calendar"), icon: Calendar },
            { key: "market", label: t("market_overview"), icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-[13px] font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-gray-900 text-gray-900"
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
          {!selectedDataset && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900">{t("available_datasets")}</h2>
                <p className="text-[13px] text-gray-500 mt-1">Select a dataset to view interactive chart</p>
              </div>
              <div className="w-full sm:w-auto">
                <select
                  className="w-full sm:w-[300px] border border-[#E5E7EB] bg-white rounded-md px-3 py-2 text-[13px] font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  onChange={(e) => setSelectedChart(e.target.value)}
                  value={selectedChart || ""}
                >
                  <option value="" disabled>-- Select an indicator --</option>
                  {datasets.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.category.toUpperCase()} - {ds.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[13.5px]">{t("loading_datasets")}</span>
            </div>
          )}

          {/* Error state — fallback to localStorage */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-red-700">{t("could_not_reach_api")}</p>
                <p className="text-[12px] text-red-500 mt-0.5">
                  {t("showing_cached_data")}: <code className="bg-red-100 px-1 rounded">{t("start_api_server")}</code>
                </p>
              </div>
            </div>
          )}

          {!isLoading && !selectedDataset && datasets.length === 0 && !error && (
            <div className="col-span-full text-center py-16 text-gray-400 border border-dashed border-[#E5E7EB] rounded-xl">
              <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px]">{t("no_datasets")}</p>
              <Link href="/admin" className="text-[13px] text-gray-900 hover:underline mt-1 inline-block">
                {t("add_one_cms")}
              </Link>
            </div>
          )}

          {!isLoading && !selectedDataset && datasets.length > 0 && (
            <div className="border border-dashed border-[#E5E7EB] rounded-xl p-16 flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50/50">
               <LineChartIcon className="w-12 h-12 mb-4 text-gray-400 opacity-50" />
               <p className="text-[14px] font-medium text-gray-600 mb-1">No chart selected</p>
               <p className="text-[13px] max-w-sm">Please select an indicator from the dropdown above to view the interactive chart and corresponding data table.</p>
            </div>
          )}

          {selectedDataset ? (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <button
                  onClick={() => setSelectedChart(null)}
                  className="flex items-center gap-1.5 text-[12.5px] text-gray-500 hover:text-gray-900 font-medium"
                >
                  ← {t("back_to_all_charts")}
                </button>
                <div className="w-full sm:w-auto">
                  <select
                    className="w-full sm:w-[300px] border border-[#E5E7EB] bg-white rounded-md px-3 py-1.5 text-[13px] font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    onChange={(e) => setSelectedChart(e.target.value)}
                    value={selectedChart || ""}
                  >
                    {datasets.map((ds) => (
                      <option key={ds.id} value={ds.id}>
                        {ds.category.toUpperCase()} - {ds.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="border border-[#E5E7EB] p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10.5px] font-semibold uppercase tracking-widest text-gray-900 bg-gray-100 px-2 py-0.5 mb-3 inline-block">
                      {selectedDataset.category}
                    </span>
                    <h2 className="text-[22px] font-semibold text-gray-900 mt-2">{selectedDataset.title}</h2>
                    <p className="text-[13px] text-gray-500 mt-1">{selectedDataset.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveView("chart")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] border transition-colors ${activeView === "chart" ? "bg-gray-900 text-white border-gray-900" : "border-[#E5E7EB] text-gray-600 hover:border-gray-400"}`}
                    >
                      <LineChartIcon className="w-3.5 h-3.5" /> {t("chart")}
                    </button>
                    <button
                      onClick={() => setActiveView("table")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] border transition-colors ${activeView === "table" ? "bg-gray-900 text-white border-gray-900" : "border-[#E5E7EB] text-gray-600 hover:border-gray-400"}`}
                    >
                      <TableIcon className="w-3.5 h-3.5" /> {t("table")}
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
                  {t("unit_label")}: {selectedDataset.unit} · {t("updated_label")}: {selectedDataset.updatedAt}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-2">{t("economic_calendar")}</h2>
          <p className="text-[13px] text-gray-400 mb-6">
            {locale === "id" ? "Data kalender ekonomi dapat dikelola melalui CMS." : "Economic calendar data can be managed via the CMS."}{" "}
            <Link href="/admin" className="text-gray-900 hover:underline">{locale === "id" ? "Buka Admin →" : "Open Admin →"}</Link>
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[13.5px]">{t("loading")}</span>
            </div>
          ) : (
            <div className="border border-[#E5E7EB]">
              <div className="grid grid-cols-4 border-b border-[#E5E7EB] bg-gray-50 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5">
                <div>{t("dataset_label")}</div><div>{t("category_label")}</div><div>{t("last_updated_label")}</div><div>{t("unit_label")}</div>
              </div>
              {datasets.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-400 text-[13px]">
                  {t("no_datasets")} <Link href="/admin" className="text-gray-900 hover:underline">{t("add_in_cms")}</Link>
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
          <h2 className="text-[18px] font-semibold text-gray-900 mb-6">{t("market_overview")}</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[13.5px]">{t("loading")}</span>
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
                    const { label, positive } = fmtChange(last, prev, t("unchanged"));
                    const lastRow = ds.rows[ds.rows.length - 1];
                    const periodKey = ds.columns[0];
                    return (
                      <div
                        key={ds.id}
                        className="border border-[#E5E7EB] p-5 cursor-pointer hover:border-gray-900 transition-colors"
                        onClick={() => { setSelectedChart(ds.id); setActiveTab("charts"); }}
                      >
                        <div className="text-[11.5px] text-gray-400 mb-1.5">{ds.title}</div>
                        <div className="text-[24px] font-bold text-gray-900 mb-1">
                          {formatValue(last, ds.unitType, ds.unit)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-600">
                            {label}
                          </span>
                          <span className="text-[11px] text-gray-400">{String(lastRow?.[periodKey] ?? "")}</span>
                        </div>
                      </div>
                    );
                  })}
                {datasets.filter((ds) => ["bi-rate", "idr-usd", "trade-balance", "gdp-growth", "inflation-rate", "sovereign-bond-yield"].includes(ds.id)).length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400 text-[13px]">
                    {t("no_datasets")} <Link href="/admin" className="text-gray-900 hover:underline">{t("add_in_cms")}</Link>
                  </div>
                )}
              </div>
              <h3 className="text-[16px] font-semibold text-gray-900 mb-5">{t("all_datasets")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {datasets.map((ds) => (
                  <div
                    key={ds.id}
                    className="border border-[#E5E7EB] p-5 cursor-pointer hover:border-gray-900 transition-colors"
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
