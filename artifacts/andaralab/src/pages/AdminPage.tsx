import { useState, useEffect } from "react";
import {
  loadDatasets, saveDataset, deleteDataset, ChartDataset,
} from "@/lib/cms-store";
import InteractiveChart from "@/components/InteractiveChart";
import {
  Plus, Trash2, Save, ChevronLeft, BarChart2, LineChart, TrendingUp, AlertCircle, CheckCircle,
} from "lucide-react";

const COLORS = ["#1a3a5c", "#e67e22", "#2ecc71", "#9b59b6", "#e74c3c", "#3498db"];
const CATEGORIES = ["Macro Foundations", "Sectoral Intelligence", "Market Dashboard", "Geopolitical Analysis", "ESG"];

function newDataset(): ChartDataset {
  return {
    id: `ds-${Date.now()}`,
    title: "New Dataset",
    description: "",
    category: "Macro Foundations",
    chartType: "line",
    color: "#1a3a5c",
    unit: "%",
    columns: ["Period", "Value"],
    rows: [
      { Period: "2023 Q1", Value: 0 },
      { Period: "2023 Q2", Value: 0 },
      { Period: "2023 Q3", Value: 0 },
      { Period: "2023 Q4", Value: 0 },
    ],
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };
}

export default function AdminPage() {
  const [datasets, setDatasets] = useState<ChartDataset[]>([]);
  const [selected, setSelected] = useState<ChartDataset | null>(null);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<"list" | "edit">("list");
  const [activeTab, setActiveTab] = useState<"meta" | "data" | "preview">("meta");

  useEffect(() => { setDatasets(loadDatasets()); }, []);

  const save = () => {
    if (!selected) return;
    const updated = { ...selected, updatedAt: new Date().toISOString().split("T")[0] };
    const all = saveDataset(updated);
    setDatasets(all);
    setSelected(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this dataset?")) return;
    const all = deleteDataset(id);
    setDatasets(all);
    if (selected?.id === id) { setSelected(null); setView("list"); }
  };

  const addColumn = () => {
    if (!selected) return;
    const name = `Series ${selected.columns.length}`;
    setSelected({
      ...selected,
      columns: [...selected.columns, name],
      rows: selected.rows.map((r) => ({ ...r, [name]: 0 })),
    });
  };

  const removeColumn = (col: string) => {
    if (!selected || selected.columns.length <= 2) return;
    const cols = selected.columns.filter((c) => c !== col);
    setSelected({
      ...selected,
      columns: cols,
      rows: selected.rows.map((r) => {
        const nr = { ...r };
        delete nr[col];
        return nr;
      }),
    });
  };

  const renameColumn = (oldName: string, newName: string) => {
    if (!selected) return;
    setSelected({
      ...selected,
      columns: selected.columns.map((c) => (c === oldName ? newName : c)),
      rows: selected.rows.map((r) => {
        const nr = { ...r };
        nr[newName] = nr[oldName];
        delete nr[oldName];
        return nr;
      }),
    });
  };

  const addRow = () => {
    if (!selected) return;
    const newRow: Record<string, string | number> = {};
    selected.columns.forEach((c, i) => { newRow[c] = i === 0 ? "New Row" : 0; });
    setSelected({ ...selected, rows: [...selected.rows, newRow] });
  };

  const removeRow = (idx: number) => {
    if (!selected) return;
    setSelected({ ...selected, rows: selected.rows.filter((_, i) => i !== idx) });
  };

  const updateCell = (rowIdx: number, col: string, val: string) => {
    if (!selected) return;
    const rows = selected.rows.map((r, i) => {
      if (i !== rowIdx) return r;
      const colIdx = selected.columns.indexOf(col);
      const isNumeric = colIdx > 0;
      return { ...r, [col]: isNumeric ? (isNaN(Number(val)) ? val : Number(val)) : val };
    });
    setSelected({ ...selected, rows });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {view === "edit" && (
            <button
              onClick={() => { setView("list"); setSelected(null); }}
              className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 font-medium mr-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <span className="text-[15px] font-semibold text-gray-900">AndaraLab CMS</span>
          <span className="text-gray-300">·</span>
          <span className="text-[13px] text-gray-500">{view === "list" ? "Datasets" : selected?.title}</span>
        </div>
        <div className="flex items-center gap-3">
          {view === "edit" && (
            <button
              onClick={save}
              className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#1a3a5c] px-4 py-1.5 hover:bg-[#14305a] transition-colors"
            >
              {saved ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save"}
            </button>
          )}
          <a href="/" className="text-[12.5px] text-gray-500 hover:text-gray-800 font-medium">← Back to site</a>
        </div>
      </div>

      {view === "list" ? (
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[22px] font-semibold text-gray-900">Data Datasets</h1>
            <button
              onClick={() => { const d = newDataset(); setSelected(d); setView("edit"); setActiveTab("meta"); }}
              className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#1a3a5c] px-4 py-2 hover:bg-[#14305a]"
            >
              <Plus className="w-4 h-4" /> New Dataset
            </button>
          </div>

          <div className="bg-white border border-[#E5E7EB]">
            <div className="grid grid-cols-12 border-b border-[#E5E7EB] bg-gray-50 px-4 py-2.5 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Rows</div>
              <div className="col-span-2">Actions</div>
            </div>
            {datasets.map((ds) => (
              <div key={ds.id} className="grid grid-cols-12 border-b border-[#F3F4F6] px-4 py-3.5 items-center hover:bg-gray-50">
                <div className="col-span-4">
                  <div className="text-[13.5px] font-semibold text-gray-900">{ds.title}</div>
                  <div className="text-[11.5px] text-gray-400 mt-0.5">{ds.description.slice(0, 50)}...</div>
                </div>
                <div className="col-span-2 text-[12.5px] text-gray-600">{ds.category}</div>
                <div className="col-span-2">
                  <span className="text-[11.5px] font-medium text-[#1a3a5c] bg-blue-50 px-2 py-0.5 capitalize">{ds.chartType}</span>
                </div>
                <div className="col-span-2 text-[12.5px] text-gray-600">{ds.rows.length} rows</div>
                <div className="col-span-2 flex items-center gap-2">
                  <button
                    onClick={() => { setSelected({ ...ds }); setView("edit"); setActiveTab("data"); }}
                    className="text-[12px] font-medium text-[#1a3a5c] hover:underline"
                  >Edit</button>
                  <button onClick={() => remove(ds.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-100 p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#1a3a5c] flex-shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-[#1a3a5c] leading-relaxed">
              Datasets are stored locally and auto-generate interactive charts on the Data Hub page. 
              Create or edit datasets here — charts update instantly.
            </p>
          </div>
        </div>
      ) : selected ? (
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          {/* Editor tabs */}
          <div className="flex gap-0 border-b border-[#E5E7EB] mb-6">
            {(["meta", "data", "preview"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-2.5 text-[13px] font-medium border-b-2 capitalize transition-colors ${
                  activeTab === t ? "border-[#1a3a5c] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {t === "meta" ? "Metadata" : t === "data" ? "Table Data" : "Preview"}
              </button>
            ))}
          </div>

          {/* Metadata tab */}
          {activeTab === "meta" && (
            <div className="bg-white border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Title", field: "title", type: "text" },
                { label: "Unit (e.g. %, IDR, USD B)", field: "unit", type: "text" },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={(selected as any)[field] || ""}
                    onChange={(e) => setSelected({ ...selected, [field]: e.target.value })}
                    className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c]"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={selected.description}
                  onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] resize-none"
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  value={selected.category}
                  onChange={(e) => setSelected({ ...selected, category: e.target.value })}
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] bg-white"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Chart Type</label>
                <div className="flex gap-2">
                  {(["line", "bar", "area"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelected({ ...selected, chartType: t })}
                      className={`flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium border transition-colors capitalize ${
                        selected.chartType === t ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-[#E5E7EB] text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {t === "line" ? <LineChart className="w-3.5 h-3.5" /> : t === "bar" ? <BarChart2 className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Data table tab */}
          {activeTab === "data" && (
            <div className="bg-white border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-gray-900">
                  Data Table — First column is X-axis label, rest are data series
                </h3>
                <div className="flex gap-2">
                  <button onClick={addColumn} className="flex items-center gap-1 text-[12px] font-medium text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 hover:bg-blue-50">
                    <Plus className="w-3.5 h-3.5" /> Add Series
                  </button>
                  <button onClick={addRow} className="flex items-center gap-1 text-[12px] font-medium text-white bg-[#1a3a5c] px-3 py-1.5 hover:bg-[#14305a]">
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px] border-collapse">
                  <thead>
                    <tr>
                      {selected.columns.map((col, i) => (
                        <th key={col} className="border border-[#E5E7EB] bg-gray-50 px-2 py-1.5 text-left">
                          <div className="flex items-center gap-1">
                            <input
                              value={col}
                              onChange={(e) => renameColumn(col, e.target.value)}
                              className="text-[12px] font-semibold text-gray-700 bg-transparent focus:outline-none w-full min-w-[80px]"
                            />
                            {i > 1 && (
                              <button onClick={() => removeColumn(col)} className="text-gray-300 hover:text-red-400 flex-shrink-0">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="border border-[#E5E7EB] bg-gray-50 px-2 py-1.5 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {selected.rows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-gray-50">
                        {selected.columns.map((col) => (
                          <td key={col} className="border border-[#F3F4F6] px-2 py-1">
                            <input
                              value={row[col] ?? ""}
                              onChange={(e) => updateCell(ri, col, e.target.value)}
                              className="w-full text-[12.5px] text-gray-800 focus:outline-none bg-transparent min-w-[80px]"
                            />
                          </td>
                        ))}
                        <td className="border border-[#F3F4F6] px-2 py-1 text-center">
                          <button onClick={() => removeRow(ri)} className="text-gray-300 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Preview tab */}
          {activeTab === "preview" && (
            <div className="bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-1">{selected.title}</h3>
              <p className="text-[12.5px] text-gray-500 mb-5">{selected.description}</p>
              <InteractiveChart dataset={selected} height={320} />
              <p className="text-[11px] text-gray-400 mt-4">Unit: {selected.unit}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
