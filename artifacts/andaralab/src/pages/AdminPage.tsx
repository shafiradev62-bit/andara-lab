import { useState, useEffect } from "react";
import {
  useDatasets, useCreateDataset, useUpdateDataset,
  useDeleteDataset, useResetDatasets,
  usePages, useCreatePage, useUpdatePage, useDeletePage, useResetPages,
  usePosts, useCreatePost, useUpdatePost, useDeletePost, useResetPosts,
  useAnalisisList, useAnalisis, useCreateAnalisis, useUpdateAnalisis,
  useDeleteAnalisis, useResetAnalisis,
  useFeaturedInsights, useUpdateFeaturedInsights, useResetFeaturedInsights,
  type ChartDataset, type Page, type BlogPost,
  type AnalisisDeskriptif, type AnalysisSection, type AnalysisWidget,
  type AnalysisMetric, type AnalysisWidgetType,
  type FeaturedInsight, type FeaturedInsightsConfig,
} from "@/lib/cms-store";
import InteractiveChart from "@/components/InteractiveChart";
import {
  Plus, Trash2, Save, ChevronLeft, BarChart2, LineChart,
  TrendingUp, AlertCircle, CheckCircle, Loader2, RefreshCw,
  Database, FileText, BookOpen, ChevronDown, ChevronRight,
  Globe, Eye, EyeOff, Link2, Unlink,
  BarChart3, PieChart, LayoutGrid, List, ArrowUp, ArrowDown,
  ArrowRight, Type, Layout, Star, Zap, Shield, Target,
  GripVertical, Edit3, Archive, Star,
} from "lucide-react";

// ─── Constants ─────────────────────────────────────────────────────────────────

const COLORS = ["#1a3a5c", "#e67e22", "#2ecc71", "#9b59b6", "#e74c3c", "#3498db"];
const CATEGORIES = [
  "Macro Foundations", "Sectoral Intelligence",
  "Market Dashboard", "Geopolitical Analysis", "ESG",
];
const BLOG_CATEGORIES = [
  "economics-101", "market-pulse", "lab-notes",
];
const SECTIONS = [
  "root", "Macro Foundations", "Sectoral Intelligence",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newDataset(): Omit<ChartDataset, "id" | "createdAt" | "updatedAt"> {
  return {
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
  };
}

/** New page draft — `status` must be chosen in the editor before Save. */
function newPage(locale: "en" | "id" = "en"): Partial<Page> {
  return {
    slug: "/new-page",
    locale,
    title: "New Page",
    description: "",
    content: [],
    navLabel: "",
    section: "root",
  };
}

/** New post draft — `status` must be chosen before Save. */
function newPost(locale: "en" | "id" = "en"): Partial<BlogPost> {
  return {
    slug: "new-post",
    locale,
    title: "New Post",
    excerpt: "",
    body: [""],
    category: "economics-101",
    tag: "",
    readTime: "5 min read",
  };
}

function normalizePageSlug(raw: string): string {
  const t = raw.trim().replace(/\s+/g, "-");
  if (!t || t === "/") return "/";
  return t.startsWith("/") ? t : `/${t}`;
}

function normalizeBlogSlug(raw: string): string {
  return raw.trim().replace(/^\/+/g, "").replace(/\s+/g, "-") || "new-post";
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ${
      status === "published"
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-gray-500"
    }`}>
      {status === "published" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {status}
    </span>
  );
}

function LocaleBadge({ locale }: { locale: string }) {
  return (
    <span className={`text-[10.5px] font-semibold uppercase px-1.5 py-0.5 ${
      locale === "id" ? "bg-gray-700 text-white" : "bg-gray-900 text-white"
    }`}>
      {locale === "id" ? "ID" : "EN"}
    </span>
  );
}

// ─── Dataset Editor ─────────────────────────────────────────────────────────────

function DatasetEditor({
  selected, draft, setDraft, onBack, onSave, isSaving, isSuccess,
}: {
  selected: ChartDataset | null; draft: Partial<ChartDataset> | null;
  setDraft: (d: Partial<ChartDataset> | null) => void;
  onBack: () => void; onSave: () => void;
  isSaving: boolean; isSuccess: boolean;
}) {
  const [tab, setTab] = useState<"meta" | "chart" | "data" | "preview">("meta");
  const effective = draft !== null ? { ...selected, ...draft } as ChartDataset : selected;
  if (!effective) return null;

  const patch = (fields: Partial<ChartDataset>) =>
    setDraft({ ...(draft ?? {}), ...fields } as Partial<ChartDataset>);

  const addColumn = () => {
    const name = `Series ${effective.columns.length}`;
    patch({ columns: [...effective.columns, name], rows: effective.rows.map((r) => ({ ...r, [name]: 0 })) });
  };

  const removeColumn = (col: string) => {
    if (effective.columns.length <= 2) return;
    patch({ columns: effective.columns.filter((c) => c !== col), rows: effective.rows.map((r) => { const nr = { ...r }; delete nr[col]; return nr; }) });
  };

  const renameColumn = (oldName: string, newName: string) => {
    patch({ columns: effective.columns.map((c) => c === oldName ? newName : c), rows: effective.rows.map((r) => { const nr = { ...r }; nr[newName] = nr[oldName]; delete nr[oldName]; return nr; }) });
  };

  const addRow = () => {
    const newRow: Record<string, string | number> = {};
    effective.columns.forEach((c, i) => { newRow[c] = i === 0 ? "New Row" : 0; });
    patch({ rows: [...effective.rows, newRow] });
  };

  const removeRow = (idx: number) => patch({ rows: effective.rows.filter((_, i) => i !== idx) });

  const updateCell = (rowIdx: number, col: string, val: string) => {
    patch({ rows: effective.rows.map((r, i) => {
      if (i !== rowIdx) return r;
      const colIdx = effective.columns.indexOf(col);
      return { ...r, [col]: colIdx > 0 ? (isNaN(Number(val)) ? val : Number(val)) : val };
    })});
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-gray-300">·</span>
        <span className="text-[13px] font-medium text-gray-700 truncate max-w-[300px]">{effective.title}</span>
      </div>

      {/* Editor tabs */}
      <div className="flex gap-0 border-b border-[#E5E7EB] mb-6">
        {(["meta", "chart", "data", "preview"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-[13px] font-medium border-b-2 capitalize transition-colors ${
              tab === t ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}>
            {t === "meta" ? "Metadata" : t === "chart" ? "Chart Labels" : t === "data" ? "Table Data" : "Preview"}
          </button>
        ))}
      </div>

      {/* Metadata tab */}
      {tab === "meta" && (
        <div className="bg-white border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Title", field: "title" as const },
            { label: "Description", field: "description" as const, textarea: true },
            { label: "Unit (e.g. %, IDR, USD B)", field: "unit" as const },
          ].map(({ label, field, textarea }) => (
            <div key={field} className={textarea || field === "description" ? "md:col-span-2" : ""}>
              <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
              {textarea ? (
                <textarea rows={2} value={(effective as any)[field] ?? ""}
                  onChange={(e) => patch({ [field]: e.target.value })}
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 resize-none" />
              ) : (
                <input type="text" value={(effective as any)[field] ?? ""}
                  onChange={(e) => patch({ [field]: e.target.value })}
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900" />
              )}
            </div>
          ))}
          <div>
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
            <select value={effective.category}
              onChange={(e) => patch({ category: e.target.value })}
              className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 bg-white">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Chart Type</label>
            <div className="flex gap-2">
              {(["line", "bar", "area"] as const).map((t) => (
                <button key={t} onClick={() => patch({ chartType: t })}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium border capitalize ${effective.chartType === t ? "bg-gray-900 text-white border-gray-900" : "border-[#E5E7EB] text-gray-600 hover:border-gray-400"}`}>
                  {t === "line" ? <LineChart className="w-3.5 h-3.5" /> : t === "bar" ? <BarChart2 className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart Labels tab — NEW */}
      {tab === "chart" && (
        <div className="bg-white border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#E5E7EB]">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-[12.5px] text-gray-600">These labels override the chart display title and axis labels. Leave blank to use defaults.</span>
            </div>
          </div>
          {[
            { label: "Chart Title (displayed above chart)", field: "chartTitle" as const },
            { label: "X-Axis Label", field: "xAxisLabel" as const },
            { label: "Y-Axis Label", field: "yAxisLabel" as const },
            { label: "Subtitle (below chart)", field: "subtitle" as const, textarea: true },
          ].map(({ label, field, textarea }) => (
            <div key={field} className={textarea || field === "chartTitle" || field === "subtitle" ? "md:col-span-2" : ""}>
              <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
              {textarea ? (
                <textarea rows={2} value={(effective as any)[field] ?? ""}
                  onChange={(e) => patch({ [field]: e.target.value })}
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 resize-none" />
              ) : (
                <input type="text" value={(effective as any)[field] ?? ""}
                  onChange={(e) => patch({ [field]: e.target.value })}
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Data table tab */}
      {tab === "data" && (
        <div className="bg-white border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-gray-600">First column = X-axis labels. Remaining columns = data series.</p>
            <div className="flex gap-2">
              <button onClick={addColumn} className="flex items-center gap-1 text-[12px] font-medium text-gray-700 border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
                <Plus className="w-3.5 h-3.5" /> Add Series
              </button>
              <button onClick={addRow} className="flex items-center gap-1 text-[12px] font-medium text-white bg-gray-900 px-3 py-1.5 hover:bg-gray-700">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] border-collapse">
              <thead>
                <tr>
                  {effective.columns.map((col, i) => (
                    <th key={col} className="border border-[#E5E7EB] bg-gray-50 px-2 py-1.5 text-left min-w-[100px]">
                      <div className="flex items-center gap-1">
                        <input value={col} onChange={(e) => renameColumn(col, e.target.value)}
                          className="text-[12px] font-semibold text-gray-700 bg-transparent focus:outline-none w-full" />
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
                {effective.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-gray-50">
                    {effective.columns.map((col) => (
                      <td key={col} className="border border-[#F3F4F6] px-2 py-1">
                        <input value={row[col] ?? ""} onChange={(e) => updateCell(ri, col, e.target.value)}
                          className="w-full text-[12.5px] text-gray-800 focus:outline-none bg-transparent" />
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
      {tab === "preview" && (
        <div className="bg-white border border-[#E5E7EB] p-6">
          <h3 className="text-[16px] font-semibold text-gray-900 mb-1">{effective.title}</h3>
          {effective.description && <p className="text-[12.5px] text-gray-500 mb-5">{effective.description}</p>}
          <InteractiveChart dataset={effective} height={320} />
          <p className="text-[11px] text-gray-400 mt-4">
            Unit: {effective.unit} · {effective.rows.length} rows
            {(effective as any).chartTitle && ` · Chart title: ${(effective as any).chartTitle}`}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page Editor ────────────────────────────────────────────────────────────────

function PageEditor({
  page, onBack, isNew, defaultLocaleForNew = "en",
}: {
  page: Page | null;
  onBack: () => void;
  isNew?: boolean;
  defaultLocaleForNew?: "en" | "id";
}) {
  const updateMut = useUpdatePage();
  const createMut = useCreatePage();
  const isSaving = updateMut.isPending || createMut.isPending;
  const [draft, setDraft] = useState<Partial<Page>>(() => (page ? { ...page } : { ...newPage(defaultLocaleForNew) }));
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setSaveError(null);
    setSavedSlug(null);
    if (page) setDraft({ ...page });
    else if (isNew) setDraft({ ...newPage(defaultLocaleForNew) });
  }, [page?.id, isNew, defaultLocaleForNew]);

  const statusOk = draft.status === "draft" || draft.status === "published";

  const handleSave = () => {
    if (!draft) return;
    setSaveError(null);
    if (!statusOk) {
      setSaveError("Pilih status dulu: Draft (hidden) atau Published (live), baru klik Save.");
      return;
    }
    const slug = normalizePageSlug(draft.slug ?? "");
    const title = (draft.title ?? "").trim();
    if (!title) {
      setSaveError("Judul halaman wajib diisi.");
      return;
    }
    const payload: Partial<Page> = { ...draft, slug, title, status: draft.status };

    if (isNew) {
      createMut.mutate(payload as Omit<Page, "id" | "createdAt" | "updatedAt">, {
        onSuccess: (saved: Page) => {
          setSavedSlug(saved.slug ?? slug);
        },
        onError: (e: Error) => setSaveError(e.message || "Gagal menyimpan"),
      });
    } else if (page?.id) {
      updateMut.mutate(
        { id: page.id, data: payload },
        {
          onSuccess: () => setSavedSlug(slug),
          onError: (e: Error) => setSaveError(e.message || "Gagal menyimpan"),
        }
      );
    }
  };

  const patch = (fields: Partial<Page>) => {
    setSaveError(null);
    setDraft((prev) => ({ ...prev, ...fields }));
  };

  const viewHref = savedSlug ? (savedSlug.startsWith("/") ? savedSlug : `/${savedSlug}`) : "/";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-gray-300">·</span>
        <span className="text-[13px] font-medium text-gray-700">
          {isNew ? "New Page" : (draft.title ?? page?.title ?? "Untitled")}
        </span>
        {page ? <StatusBadge status={page.status} /> : draft.status ? <StatusBadge status={draft.status} /> : null}
        <LocaleBadge locale={(draft.locale ?? page?.locale ?? "en") as "en" | "id"} />
      </div>

      <div className="bg-white border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="md:col-span-2">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-4 pb-3 border-b border-[#E5E7EB]">Page Identity</div>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Slug (URL path)</label>
          <input type="text" value={draft.slug ?? ""}
            onChange={(e) => patch({ slug: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 font-mono" />
          <p className="text-[10.5px] text-gray-400 mt-1">e.g. /macro/macro-outlooks or /about</p>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Language</label>
          <div className="flex gap-2">
            {(["en", "id"] as const).map((l) => (
              <button key={l} onClick={() => patch({ locale: l })}
                className={`px-4 py-2 text-[12.5px] font-semibold border capitalize ${
                  draft.locale === l ? "bg-gray-900 text-white border-gray-900" : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                }`}>
                {l === "en" ? "English" : "Bahasa Indonesia"}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Page Title</label>
          <input type="text" value={draft.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-gray-900" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Meta Description (SEO)</label>
          <textarea rows={2} value={draft.description ?? ""}
            onChange={(e) => patch({ description: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 resize-none" />
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Navigation Label</label>
          <input type="text" value={draft.navLabel ?? ""}
            onChange={(e) => patch({ navLabel: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900" />
          <p className="text-[10.5px] text-gray-400 mt-1">Short label shown in the top navigation bar</p>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Section</label>
          <select value={draft.section ?? "root"}
            onChange={(e) => patch({ section: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 bg-white">
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["draft", "published"] as const).map((s) => (
              <button key={s} type="button" onClick={() => patch({ status: s })}
                className={`px-4 py-2 text-[12.5px] font-semibold border capitalize ${
                  draft.status === s ? "bg-gray-900 text-white border-gray-900" : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                }`}>
                {s === "published" ? "Published (live)" : "Draft (hidden)"}
              </button>
            ))}
          </div>
          <p className="text-[10.5px] text-gray-500 mt-2">
            Wajib pilih salah satu sebelum Save. Hanya <strong>Published (live)</strong> yang tampil di situs publik.
          </p>
        </div>

        {/* Linked page info */}
        {!isNew && page?.linkedIdRecord && (
          <div className="md:col-span-2 bg-gray-50 border border-gray-200 p-4 flex items-start gap-3">
            <Link2 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[12.5px] font-semibold text-gray-700">Linked translation</p>
              <p className="text-[12px] text-gray-500 mt-0.5">
                This page is linked to the <LocaleBadge locale={page.linkedIdRecord.locale} /> version:
                <strong className="ml-1">{page.linkedIdRecord.title}</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {saveError && (
        <div className="mb-4 flex items-start gap-2 text-[12.5px] text-red-700 bg-red-50 border border-red-200 px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !statusOk}
          title={!statusOk ? "Pilih Draft atau Published terlebih dahulu" : undefined}
          className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-5 py-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving…" : "Save Page"}
        </button>
        {(updateMut.isSuccess || createMut.isSuccess) && !savedSlug && (
          <span className="text-[12px] text-gray-600 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* Post-save success panel */}
      {savedSlug && (
        <div className="mt-4 bg-gray-50 border border-gray-200 p-4">
          <p className="text-[12.5px] font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-gray-700" />
            Page saved successfully
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={viewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-medium text-gray-900 underline"
            >
              View on site → {window.location.origin}{viewHref}
            </a>
            {draft.status === "draft" && (
              <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1">
                Draft tidak tampil di situs sampai Anda pilih Published lalu Save lagi.
              </span>
            )}
            <span className="text-gray-300">·</span>
            <button
              onClick={() => { setSavedSlug(null); onBack(); }}
              className="text-[12.5px] text-gray-500 hover:text-gray-800 underline"
            >
              Back to list
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Blog Post Editor ──────────────────────────────────────────────────────────

function PostEditor({
  post, onBack, isNew, defaultLocaleForNew = "en",
}: {
  post: BlogPost | null;
  onBack: () => void;
  isNew?: boolean;
  defaultLocaleForNew?: "en" | "id";
}) {
  const updateMut = useUpdatePost();
  const createMut = useCreatePost();
  const isSaving = updateMut.isPending || createMut.isPending;
  const [draft, setDraft] = useState<Partial<BlogPost>>(() =>
    post ? { ...post } : { ...newPost(defaultLocaleForNew) }
  );
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setSaveError(null);
    setSavedSlug(null);
    if (post) setDraft({ ...post });
    else if (isNew) setDraft({ ...newPost(defaultLocaleForNew) });
  }, [post?.id, isNew, defaultLocaleForNew]);

  const statusOk = draft.status === "draft" || draft.status === "published";

  const handleSave = () => {
    if (!draft) return;
    setSaveError(null);
    if (!statusOk) {
      setSaveError("Pilih status dulu: Draft atau Published, baru klik Save.");
      return;
    }
    const slug = normalizeBlogSlug(draft.slug ?? "");
    const title = (draft.title ?? "").trim();
    if (!title) {
      setSaveError("Judul posting wajib diisi.");
      return;
    }
    const bodyLines = Array.isArray(draft.body) ? draft.body : [""];
    const payload: Partial<BlogPost> = {
      ...draft,
      slug,
      title,
      body: bodyLines,
      status: draft.status,
    };

    if (isNew) {
      createMut.mutate(payload as Omit<BlogPost, "id" | "createdAt" | "updatedAt">, {
        onSuccess: (saved: BlogPost) => setSavedSlug(saved.slug ?? slug),
        onError: (e: Error) => setSaveError(e.message || "Gagal menyimpan"),
      });
    } else if (post?.id) {
      updateMut.mutate(
        { id: post.id, data: payload },
        {
          onSuccess: () => setSavedSlug(slug),
          onError: (e: Error) => setSaveError(e.message || "Gagal menyimpan"),
        }
      );
    }
  };

  const patch = (fields: Partial<BlogPost>) => {
    setSaveError(null);
    setDraft((prev) => ({ ...prev, ...fields }));
  };

  const bodyLines = Array.isArray(draft.body) ? draft.body : [""];
  const setBodyLines = (lines: string[]) => patch({ body: lines });

  const articleHref = savedSlug ? `/article/${savedSlug}` : "/blog";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-gray-300">·</span>
        <span className="text-[13px] font-medium text-gray-700">
          {isNew ? "New Blog Post" : (draft.title ?? post?.title ?? "Untitled")}
        </span>
        {post ? <StatusBadge status={post.status} /> : draft.status ? <StatusBadge status={draft.status} /> : null}
        <LocaleBadge locale={(draft.locale ?? post?.locale ?? "en") as "en" | "id"} />
      </div>

      <div className="bg-white border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="md:col-span-2">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-4 pb-3 border-b border-[#E5E7EB]">Post Identity</div>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Slug</label>
          <input type="text" value={draft.slug ?? ""}
            onChange={(e) => patch({ slug: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 font-mono" />
          <p className="text-[10.5px] text-gray-400 mt-1">URL slug, e.g. my-post-title</p>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Language</label>
          <div className="flex gap-2">
            {(["en", "id"] as const).map((l) => (
              <button key={l} onClick={() => patch({ locale: l })}
                className={`px-4 py-2 text-[12.5px] font-semibold border capitalize ${
                  draft.locale === l ? "bg-gray-900 text-white border-gray-900" : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                }`}>
                {l === "en" ? "English" : "Bahasa Indonesia"}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
          <input type="text" value={draft.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-gray-900" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Excerpt</label>
          <textarea rows={2} value={draft.excerpt ?? ""}
            onChange={(e) => patch({ excerpt: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 resize-none" />
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
          <select value={draft.category ?? "economics-101"}
            onChange={(e) => patch({ category: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 bg-white">
            {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tag</label>
          <input type="text" value={draft.tag ?? ""}
            onChange={(e) => patch({ tag: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900" />
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Read Time</label>
          <input type="text" value={draft.readTime ?? ""}
            onChange={(e) => patch({ readTime: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900"
            placeholder="e.g. 5 min read" />
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["draft", "published"] as const).map((s) => (
              <button key={s} type="button" onClick={() => patch({ status: s })}
                className={`px-4 py-2 text-[12.5px] font-semibold border capitalize ${
                  draft.status === s ? "bg-gray-900 text-white border-gray-900" : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                }`}>
                {s === "published" ? "Published (live)" : "Draft (hidden)"}
              </button>
            ))}
          </div>
          <p className="text-[10.5px] text-gray-500 mt-2">
            Wajib pilih salah satu sebelum Save. Hanya <strong>Published (live)</strong> yang tampil di situs.
          </p>
        </div>

        {/* Body editor */}
        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Body — Paragraphs (one per line)
          </label>
          <textarea rows={bodyLines.length + 2} value={bodyLines.join("\n")}
            onChange={(e) => setBodyLines(e.target.value.split("\n"))}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 resize-y font-mono leading-relaxed"
            placeholder="Enter paragraph text… Each line becomes a new paragraph." />
          <p className="text-[10.5px] text-gray-400 mt-1">{bodyLines.length} paragraph{bodyLines.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {saveError && (
        <div className="mb-4 flex items-start gap-2 text-[12.5px] text-red-700 bg-red-50 border border-red-200 px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !statusOk}
          title={!statusOk ? "Pilih Draft atau Published terlebih dahulu" : undefined}
          className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-5 py-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving…" : "Save Post"}
        </button>
        {(updateMut.isSuccess || createMut.isSuccess) && !savedSlug && (
          <span className="text-[12px] text-gray-600 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* Post-save success panel */}
      {savedSlug && (
        <div className="mt-4 bg-gray-50 border border-gray-200 p-4">
          <p className="text-[12.5px] font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-gray-700" />
            Post saved successfully
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={articleHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-medium text-gray-900 underline"
            >
              View article → {window.location.origin}{articleHref}
            </a>
            {draft.status === "draft" && (
              <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1">
                Draft: artikel tidak tampil sampai Published + Save.
              </span>
            )}
            <span className="text-gray-300">·</span>
            <button
              type="button"
              onClick={() => { setSavedSlug(null); onBack(); }}
              className="text-[12.5px] text-gray-500 hover:text-gray-800 underline"
            >
              Back to list
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Featured Insights Tab ──────────────────────────────────────────────────────

function FeaturedInsightsTab() {
  const [activeLocale, setActiveLocale] = useState<"en" | "id">("en");
  const { data: config, isLoading } = useFeaturedInsights(activeLocale);
  const updateMut = useUpdateFeaturedInsights();
  const resetMut = useResetFeaturedInsights();

  const { data: allPosts = [] } = usePosts({ status: "published", locale: activeLocale });
  const postsBySlug = new Map(allPosts.map((p) => [p.slug, p]));

  const [draft, setDraft] = useState<FeaturedInsightsConfig | null>(null);

  useEffect(() => {
    if (config) setDraft({ ...config, slugs: [...config.slugs] });
  }, [config]);

  if (isLoading || !draft) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
      </div>
    );
  }

  const handleSave = () => {
    updateMut.mutate(
      { locale: activeLocale, data: draft },
      { onSuccess: (updated) => setDraft({ ...updated, slugs: [...updated.slugs] }) },
    );
  };

  const handleReset = () => {
    if (!confirm("Reset Featured Insights to seed state?")) return;
    resetMut.mutate(undefined, { onSuccess: () => setActiveLocale(activeLocale === "en" ? "id" : "en") });
  };

  const currentSlugs = new Set(draft.slugs.map((s) => s.slug));

  const addSlug = (slug: string) => {
    const order = draft.slugs.length > 0 ? Math.max(...draft.slugs.map((s) => s.order)) + 1 : 1;
    setDraft({ ...draft, slugs: [...draft.slugs, { slug, label: "", order }] });
  };

  const removeSlug = (slug: string) => {
    setDraft({ ...draft, slugs: draft.slugs.filter((s) => s.slug !== slug) });
  };

  const moveSlug = (slug: string, direction: -1 | 1) => {
    const sorted = [...draft.slugs].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.slug === slug);
    const target = idx + direction;
    if (target < 0 || target >= sorted.length) return;
    const reordered = sorted.map((s, i) => {
      if (i === idx) return { ...s, order: sorted[target].order };
      if (i === target) return { ...s, order: sorted[idx].order };
      return s;
    });
    setDraft({ ...draft, slugs: reordered });
  };

  const patchMeta = (field: keyof Pick<FeaturedInsightsConfig, "title" | "subtitle" | "sectionLabel" | "limit">, value: string | number) => {
    setDraft({ ...draft, [field]: value });
  };

  const isSaving = updateMut.isPending;
  const availablePosts = allPosts.filter((p) => !currentSlugs.has(p.slug));
  const orderedSlugs = [...draft.slugs].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-900">Featured Insights</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Configure which research posts appear on the homepage — order, title, subtitle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} disabled={resetMut.isPending}
            className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50">
            {resetMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Reset
          </button>
          <button onClick={handleSave} disabled={isSaving}
            className="flex items-center gap-1.5 text-[12px] font-semibold bg-gray-900 text-white px-4 py-1.5 hover:bg-gray-700 disabled:opacity-50">
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Changes
          </button>
        </div>
      </div>

      {/* Locale toggle */}
      <div className="flex items-center gap-1 border border-gray-200 rounded p-0.5 mb-6 w-fit">
        {(["en", "id"] as const).map((loc) => (
          <button key={loc} onClick={() => setActiveLocale(loc)}
            className={`px-4 py-1.5 text-[12px] font-semibold rounded transition-colors ${
              activeLocale === loc ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
            }`}>
            {loc === "en" ? "English" : "Bahasa Indonesia"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: config meta */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
            <h3 className="text-[13px] font-semibold text-gray-900">Section Settings</h3>
            {(["sectionLabel", "title", "subtitle"] as const).map((field) => (
              <div key={field}>
                <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  {field === "sectionLabel" ? "Section Label" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input value={draft[field]} onChange={(e) => patchMeta(field, e.target.value)}
                  className="mt-1 w-full text-[13px] border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900" />
              </div>
            ))}
            <div>
              <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Max Posts</label>
              <input type="number" min={1} max={10} value={draft.limit}
                onChange={(e) => patchMeta("limit", Number(e.target.value))}
                className="mt-1 w-full text-[13px] border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="showOnHomepage" checked={draft.showOnHomepage}
                onChange={(e) => setDraft({ ...draft, showOnHomepage: e.target.checked })} className="w-4 h-4 accent-gray-900" />
              <label htmlFor="showOnHomepage" className="text-[12.5px] text-gray-700">Show on Homepage</label>
            </div>
          </div>
          {updateMut.isSuccess && (
            <div className="flex items-center gap-1.5 text-[12px] text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
              <CheckCircle className="w-3.5 h-3.5" /> Saved successfully
            </div>
          )}
        </div>

        {/* Right: post selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-1">Selected Posts</h3>
            <p className="text-[11px] text-gray-400 mb-4">
              Order 1 = hero card (spans 2 cols) · {draft.slugs.length}/{draft.limit} slots used
            </p>
            {orderedSlugs.length === 0 ? (
              <div className="text-center py-8 text-[12px] text-gray-400 border border-dashed border-gray-200 rounded">
                No posts selected — add from below
              </div>
            ) : (
              <div className="space-y-2">
                {orderedSlugs.map((item, idx) => {
                  const post = postsBySlug.get(item.slug);
                  return (
                    <div key={item.slug} className="flex items-center gap-3 border border-gray-200 rounded px-3 py-2.5 hover:border-gray-300 transition-colors">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        idx === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}>{item.order}</div>
                      <div className="flex-1 min-w-0">
                        {post ? (
                          <div>
                            <div className="text-[12.5px] font-semibold text-gray-900 truncate">{post.title}</div>
                            <div className="text-[11px] text-gray-400">{post.category} · {post.readTime}</div>
                          </div>
                        ) : (
                          <div className="text-[12.5px] text-gray-400 italic">Unknown: {item.slug}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveSlug(item.slug, -1)} disabled={idx === 0}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed" title="Move up">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => moveSlug(item.slug, 1)} disabled={idx === orderedSlugs.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed" title="Move down">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeSlug(item.slug)} className="p-1 text-gray-400 hover:text-red-500" title="Remove">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Add a Post</h3>
            {availablePosts.length === 0 ? (
              <p className="text-[12px] text-gray-400">All published posts are already selected.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availablePosts.map((post) => (
                  <button key={post.slug} onClick={() => addSlug(post.slug)}
                    className="flex items-center gap-1.5 text-[11.5px] font-medium border border-gray-300 rounded px-2.5 py-1 hover:border-gray-900 hover:text-gray-900 transition-colors bg-white text-gray-600">
                    <Plus className="w-3 h-3" />
                    <span className="truncate max-w-[180px]">{post.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Data Hub Tab ──────────────────────────────────────────────────────────────

function DataHubTab() {
  const { data: datasets = [], isLoading } = useDatasets();
  const createMut  = useCreateDataset();
  const updateMut  = useUpdateDataset();
  const deleteMut = useDeleteDataset();
  const resetMut  = useResetDatasets();

  const [selected, setSelected]   = useState<ChartDataset | null>(null);
  const [draft, setDraft]         = useState<Partial<ChartDataset> | null>(null);
  const [view, setView]          = useState<"list" | "edit">("list");

  const effective = draft !== null ? { ...selected, ...draft } as ChartDataset : selected;

  const handleSave = () => {
    if (!effective) return;
    const { id, createdAt, updatedAt, ...rest } = effective;
    if (effective.id.startsWith("tmp-")) {
      createMut.mutate(rest as any, { onSuccess: (created) => { setSelected(created); setDraft(null); setView("list"); } });
    } else {
      updateMut.mutate({ id: effective.id, data: rest }, { onSuccess: (updated) => { setSelected(updated); setDraft(null); } });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this dataset? This cannot be undone.")) return;
    deleteMut.mutate(id, { onSuccess: () => { if (selected?.id === id) { setSelected(null); setDraft(null); setView("list"); } } });
  };

  const handleReset = () => {
    if (!confirm("Reset all datasets to seed state? All edits will be lost.")) return;
    resetMut.mutate(undefined, { onSuccess: () => { setSelected(null); setDraft(null); setView("list"); } });
  };

  const openNew = () => {
    const d = newDataset();
    const temp: ChartDataset = { ...d, id: `tmp-${Date.now()}`, createdAt: "", updatedAt: "" } as any;
    setSelected(temp); setDraft(d); setView("edit");
  };

  const openEdit = (ds: ChartDataset) => {
    setSelected(ds); setDraft(null); setView("edit");
  };

  const isSaving = createMut.isPending || updateMut.isPending;

  return (
    <div>
      {view === "list" ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-semibold text-gray-900">Data Datasets</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {isLoading ? "Loading…" : `${datasets.length} datasets — served from API`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleReset} disabled={resetMut.isPending}
                className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50">
                {resetMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Reset to Seed
              </button>
              <button onClick={openNew}
                className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-4 py-2 hover:bg-gray-700">
                <Plus className="w-4 h-4" /> New Dataset
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-[13.5px]">Fetching from API…</span>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E7EB]">
              <div className="grid grid-cols-12 border-b border-[#E5E7EB] bg-gray-50 px-4 py-2.5 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">
                <div className="col-span-4">Title</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Rows</div>
                <div className="col-span-2">Actions</div>
              </div>
              {datasets.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-[14px]">No datasets found.</p>
                </div>
              ) : datasets.map((ds) => (
                <div key={ds.id} className="grid grid-cols-12 border-b border-[#F3F4F6] px-4 py-3.5 items-center hover:bg-gray-50">
                  <div className="col-span-4">
                    <div className="text-[13.5px] font-semibold text-gray-900">{ds.title}</div>
                    <div className="text-[11.5px] text-gray-400 mt-0.5">{ds.description?.slice(0, 55)}{ds.description?.length > 55 ? "…" : ""}</div>
                  </div>
                  <div className="col-span-2 text-[12.5px] text-gray-600">{ds.category}</div>
                  <div className="col-span-2">
                    <span className="text-[11.5px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 capitalize">{ds.chartType}</span>
                  </div>
                  <div className="col-span-2 text-[12.5px] text-gray-600">{ds.rows.length} rows</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <button onClick={() => openEdit(ds)} className="text-[12px] font-medium text-gray-900 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(ds.id)} disabled={deleteMut.isPending} className="text-gray-400 hover:text-red-500 disabled:opacity-40">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 bg-gray-50 border border-gray-200 p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-gray-600 leading-relaxed">
              All data is served via the <strong>REST API</strong> backed by an in-memory store.
              Click "Reset to Seed" to restore original datasets.
              In production, replace the store with PostgreSQL + Drizzle ORM.
            </p>
          </div>
        </div>
      ) : (
        <DatasetEditor
          selected={selected} draft={draft} setDraft={setDraft}
          onBack={() => { setSelected(null); setDraft(null); setView("list"); }}
          onSave={handleSave}
          isSaving={isSaving}
          isSuccess={updateMut.isSuccess || createMut.isSuccess}
        />
      )}
    </div>
  );
}

// ─── Pages Tab ─────────────────────────────────────────────────────────────────

function PagesTab() {
  const [localeFilter, setLocaleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editPage, setEditPage] = useState<Page | null>(null);
  const [isNewPage, setIsNewPage] = useState(false);
  const [newPageLocale, setNewPageLocale] = useState<"en" | "id">("en");
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const filter: any = {};
  if (localeFilter !== "all") filter.locale = localeFilter;
  if (statusFilter !== "all") filter.status = statusFilter;

  const { data: pages = [], isLoading } = usePages(filter);
  const deleteMut = useDeletePage();
  const resetMut = useResetPages();

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete page "${title}"?`)) return;
    deleteMut.mutate(id, { onSuccess: () => {
      if (expandedId === id) setExpandedId(null);
      setDeleteSuccess(`"${title}" deleted`);
      setTimeout(() => setDeleteSuccess(null), 4000);
    } });
  };

  const openNew = (locale: "en" | "id") => {
    setNewPageLocale(locale);
    setEditPage(null as any);
    setIsNewPage(true);
  };

  const openEdit = (page: Page) => {
    setEditPage(page);
    setIsNewPage(false);
    setExpandedId(null);
  };

  // Group pages by slug to show EN↔ID pairs
  const grouped = pages.reduce<Record<string, Page[]>>((acc, p) => {
    const key = p.slug;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  if (editPage !== null || isNewPage) {
    return (
      <div>
        <PageEditor
          page={isNewPage ? null : editPage}
          onBack={() => { setEditPage(null); setIsNewPage(false); }}
          isNew={isNewPage}
          defaultLocaleForNew={newPageLocale}
        />
      </div>
    );
  }

  return (
    <div>
      {deleteSuccess && (
        <div className="mb-4 bg-gray-50 border border-gray-200 p-3 flex items-center justify-between">
          <span className="text-[12.5px] text-gray-700">
            <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
            {deleteSuccess}
          </span>
          <a href="/admin" className="text-[12px] text-gray-900 underline">Refresh list</a>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-900">Pages</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {isLoading ? "Loading…" : `${pages.length} page versions across ${Object.keys(grouped).length} pages`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => resetMut.mutate(undefined)} disabled={resetMut.isPending}
            className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50">
            {resetMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Reset
          </button>
          <button onClick={() => openNew("en")}
            className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-4 py-2 hover:bg-gray-700">
            <Plus className="w-4 h-4" /> New Page (EN)
          </button>
          <button onClick={() => openNew("id")}
            className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-700 px-4 py-2 hover:bg-gray-800">
            <Plus className="w-4 h-4" /> New Page (ID)
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11.5px] text-gray-500 font-medium">Filter:</span>
        {[["all", "All"], ["en", "English"], ["id", "Indonesia"]].map(([v, label]) => (
          <button key={v} onClick={() => setLocaleFilter(v)}
            className={`px-3 py-1 text-[12px] font-medium border ${
              localeFilter === v ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{label}</button>
        ))}
        <div className="h-4 w-px bg-gray-200 mx-1" />
        {[["all", "All"], ["published", "Published"], ["draft", "Draft"]].map(([v, label]) => (
          <button key={v} onClick={() => setStatusFilter(v)}
            className={`px-3 py-1 text-[12px] font-medium border ${
              statusFilter === v ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{label}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-[13.5px]">Loading…</span>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB]">
          {/* Table header */}
          <div className="grid grid-cols-12 border-b border-[#E5E7EB] bg-gray-50 px-4 py-2.5 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-1" />
            <div className="col-span-3">Title</div>
            <div className="col-span-3">Slug</div>
            <div className="col-span-2">Language</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          {Object.keys(grouped).length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px]">No pages found for this filter.</p>
            </div>
          ) : Object.entries(grouped).map(([slug, pgList]) => {
            const enPage = pgList.find((p) => p.locale === "en");
            const idPage = pgList.find((p) => p.locale === "id");
            const anyPage = pgList[0];
            const isExpanded = expandedId === anyPage.id;

            return (
              <div key={slug}>
                {/* Group header / first row */}
                <div className="grid grid-cols-12 border-b border-[#F3F4F6] px-4 py-3 items-center hover:bg-gray-50">
                  <div className="col-span-1">
                    <button onClick={() => setExpandedId(isExpanded ? null : anyPage.id)}
                      className="text-gray-400 hover:text-gray-700">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      {enPage && <LocaleBadge locale="en" />}
                      {idPage && <LocaleBadge locale="id" />}
                      <span className="text-[13.5px] font-semibold text-gray-900 truncate">{anyPage.title}</span>
                    </div>
                    {enPage && idPage && (
                      <p className="text-[10.5px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Linked (EN + ID)
                      </p>
                    )}
                  </div>
                  <div className="col-span-3 text-[12px] text-gray-500 font-mono truncate">{slug}</div>
                  <div className="col-span-2 flex items-center gap-1">
                    {enPage && <LocaleBadge locale="en" />}
                    {idPage && <><span className="text-gray-300">·</span><LocaleBadge locale="id" /></>}
                  </div>
                  <div className="col-span-1">
                    <StatusBadge status={anyPage.status} />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <button onClick={() => openEdit(anyPage)} className="text-[12px] font-medium text-gray-900 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(anyPage.id, anyPage.title)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded: show both EN and ID rows */}
                {isExpanded && pgList.map((p) => (
                  <div key={p.id} className="grid grid-cols-12 border-b border-[#F3F4F6] px-4 py-2.5 bg-gray-50/50 items-center">
                    <div className="col-span-1" />
                    <div className="col-span-3 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <LocaleBadge locale={p.locale} />
                        <span className="text-[12.5px] font-semibold text-gray-700">{p.title}</span>
                      </div>
                      <div className="text-[11px] text-gray-400">{p.navLabel ? `Nav: "${p.navLabel}"` : `Section: ${p.section}`}</div>
                    </div>
                    <div className="col-span-3 text-[12px] text-gray-400 font-mono pl-4">{p.slug}</div>
                    <div className="col-span-2"><LocaleBadge locale={p.locale} /></div>
                    <div className="col-span-1"><StatusBadge status={p.status} /></div>
                    <div className="col-span-2 flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="text-[12px] font-medium text-gray-900 hover:underline">Edit</button>
                      {p.linkedIdRecord && (
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Link2 className="w-3 h-3" /> linked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Blog Tab ──────────────────────────────────────────────────────────────────

function BlogTab() {
  const [localeFilter, setLocaleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);
  const [newPostLocale, setNewPostLocale] = useState<"en" | "id">("en");
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const filter: any = {};
  if (localeFilter !== "all") filter.locale = localeFilter;
  if (statusFilter !== "all") filter.status = statusFilter;
  if (categoryFilter !== "all") filter.category = categoryFilter;

  const { data: posts = [], isLoading } = usePosts(filter);
  const deleteMut = useDeletePost();
  const resetMut = useResetPosts();

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete post "${title}"?`)) return;
    deleteMut.mutate(id, { onSuccess: () => {
      if (expandedId === id) setExpandedId(null);
      setDeleteSuccess(`"${title}" deleted`);
      setTimeout(() => setDeleteSuccess(null), 4000);
    } });
  };

  if (editPost !== null || isNewPost) {
    return (
      <div>
        <PostEditor
          post={isNewPost ? null : editPost}
          onBack={() => { setEditPost(null); setIsNewPost(false); }}
          isNew={isNewPost}
          defaultLocaleForNew={newPostLocale}
        />
      </div>
    );
  }

  // Group by slug to show EN↔ID pairs
  const grouped = posts.reduce<Record<string, BlogPost[]>>((acc, p) => {
    const key = p.slug;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div>
      {deleteSuccess && (
        <div className="mb-4 bg-gray-50 border border-gray-200 p-3 flex items-center justify-between">
          <span className="text-[12.5px] text-gray-700">
            <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
            {deleteSuccess}
          </span>
          <a href="/admin" className="text-[12px] text-gray-900 underline">Refresh list</a>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-900">Blog Posts</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {isLoading ? "Loading…" : `${posts.length} post versions across ${Object.keys(grouped).length} posts`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => resetMut.mutate(undefined)} disabled={resetMut.isPending}
            className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50">
            {resetMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Reset
          </button>
          <button type="button" onClick={() => { setNewPostLocale("en"); setEditPost(null as any); setIsNewPost(true); }}
            className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-4 py-2 hover:bg-gray-700">
            <Plus className="w-4 h-4" /> New Post (EN)
          </button>
          <button type="button" onClick={() => { setNewPostLocale("id"); setEditPost(null as any); setIsNewPost(true); }}
            className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-700 px-4 py-2 hover:bg-gray-800">
            <Plus className="w-4 h-4" /> New Post (ID)
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-[11.5px] text-gray-500 font-medium">Language:</span>
        {[["all", "All"], ["en", "English"], ["id", "Indonesia"]].map(([v, label]) => (
          <button key={v} onClick={() => setLocaleFilter(v)}
            className={`px-3 py-1 text-[12px] font-medium border ${
              localeFilter === v ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{label}</button>
        ))}
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <span className="text-[11.5px] text-gray-500 font-medium">Status:</span>
        {[["all", "All"], ["published", "Published"], ["draft", "Draft"]].map(([v, label]) => (
          <button key={v} onClick={() => setStatusFilter(v)}
            className={`px-3 py-1 text-[12px] font-medium border ${
              statusFilter === v ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{label}</button>
        ))}
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <span className="text-[11.5px] text-gray-500 font-medium">Category:</span>
        {[["all", "All"], ...BLOG_CATEGORIES.map((c) => [c, c] as [string, string])].map(([v, label]) => (
          <button key={v} onClick={() => setCategoryFilter(v)}
            className={`px-3 py-1 text-[12px] font-medium border ${
              categoryFilter === v ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{label}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-[13.5px]">Loading…</span>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB]">
          <div className="grid grid-cols-12 border-b border-[#E5E7EB] bg-gray-50 px-4 py-2.5 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-1" />
            <div className="col-span-3">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Language</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Tag</div>
            <div className="col-span-2">Actions</div>
          </div>

          {Object.keys(grouped).length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px]">No posts found for this filter.</p>
            </div>
          ) : Object.entries(grouped).map(([slug, postList]) => {
            const anyPost = postList[0];
            const isExpanded = expandedId === anyPost.id;

            return (
              <div key={slug}>
                <div className="grid grid-cols-12 border-b border-[#F3F4F6] px-4 py-3 items-center hover:bg-gray-50">
                  <div className="col-span-1">
                    <button onClick={() => setExpandedId(isExpanded ? null : anyPost.id)}
                      className="text-gray-400 hover:text-gray-700">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      {postList.find((p) => p.locale === "en") && <LocaleBadge locale="en" />}
                      {postList.find((p) => p.locale === "id") && <><span className="text-gray-300">·</span><LocaleBadge locale="id" /></>}
                      <span className="text-[13.5px] font-semibold text-gray-900 truncate">{anyPost.title}</span>
                    </div>
                    {postList.length > 1 && (
                      <p className="text-[10.5px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Linked (EN + ID)
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 text-[12px] text-gray-600">{anyPost.category}</div>
                  <div className="col-span-2 flex items-center gap-1">
                    {postList.find((p) => p.locale === "en") && <LocaleBadge locale="en" />}
                    {postList.length > 1 && <><span className="text-gray-300">·</span><LocaleBadge locale="id" /></>}
                  </div>
                  <div className="col-span-1"><StatusBadge status={anyPost.status} /></div>
                  <div className="col-span-1 text-[12px] text-gray-400">{anyPost.tag}</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <button onClick={() => { setEditPost(anyPost); setIsNewPost(false); setExpandedId(null); }}
                      className="text-[12px] font-medium text-gray-900 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(anyPost.id, anyPost.title)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isExpanded && postList.map((p) => (
                  <div key={p.id} className="grid grid-cols-12 border-b border-[#F3F4F6] px-4 py-2.5 bg-gray-50/50 items-center">
                    <div className="col-span-1" />
                    <div className="col-span-3 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <LocaleBadge locale={p.locale} />
                        <span className="text-[12.5px] font-semibold text-gray-700">{p.title}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 line-clamp-1">{p.excerpt}</div>
                    </div>
                    <div className="col-span-2 text-[12px] text-gray-600 pl-4">{p.category}</div>
                    <div className="col-span-2"><LocaleBadge locale={p.locale} /></div>
                    <div className="col-span-1"><StatusBadge status={p.status} /></div>
                    <div className="col-span-1 text-[12px] text-gray-400">{p.tag}</div>
                    <div className="col-span-2 flex items-center gap-2">
                      <button onClick={() => { setEditPost(p); setIsNewPost(false); }}
                        className="text-[12px] font-medium text-gray-900 hover:underline">Edit</button>
                      {p.linkedIdRecord && <span className="text-[11px] text-gray-400 flex items-center gap-1"><Link2 className="w-3 h-3" /> linked</span>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Analisis Deskriptif Tab ────────────────────────────────────────────────────

const WIDGET_TYPES: { value: AnalysisWidgetType; label: string; icon: React.ReactNode }[] = [
  { value: "metric-card", label: "Metric Card", icon: <Target className="w-3.5 h-3.5" /> },
  { value: "distribution", label: "Distribution", icon: <PieChart className="w-3.5 h-3.5" /> },
  { value: "comparison", label: "Comparison Table", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: "highlight", label: "Highlight / Callout", icon: <Zap className="w-3.5 h-3.5" /> },
  { value: "bar-chart", label: "Bar Chart", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { value: "donut-chart", label: "Donut Chart", icon: <PieChart className="w-3.5 h-3.5" /> },
  { value: "custom-text", label: "Custom Text", icon: <Type className="w-3.5 h-3.5" /> },
];

const SECTION_TYPES = [
  { value: "overview", label: "Overview / Summary" },
  { value: "dataset-breakdown", label: "Dataset Breakdown" },
  { value: "blog-insights", label: "Blog Insights" },
  { value: "custom", label: "Custom Analysis" },
];

function newMetric(): AnalysisMetric {
  return {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    label: "New Metric",
    value: "0",
    trend: "neutral",
    trendValue: "",
    note: "",
  };
}

function newWidget(type: AnalysisWidgetType): AnalysisWidget {
  const id = `w-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
  const base: AnalysisWidget = { id, type, title: "" };
  if (type === "metric-card") return { ...base, metrics: [newMetric()] };
  if (type === "distribution") return { ...base, distributionItems: [] };
  if (type === "comparison") return { ...base, compareHeaders: ["Item", "Value 1", "Value 2"], compareItems: [] };
  if (type === "highlight") return { ...base, calloutColor: "#1a3a5c", text: "" };
  if (type === "bar-chart") return { ...base, barData: [] };
  if (type === "donut-chart") return { ...base, barData: [] };
  if (type === "custom-text") return { ...base, text: "" };
  return base;
}

function newSection(order: number): AnalysisSection {
  return {
    id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    title: "New Section",
    titleEn: "",
    description: "",
    descriptionEn: "",
    locale: "both",
    sectionType: "custom",
    order,
    widgets: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function WidgetEditor({
  widget, onChange,
}: {
  widget: AnalysisWidget;
  onChange: (w: AnalysisWidget) => void;
}) {
  const patch = (fields: Partial<AnalysisWidget>) => onChange({ ...widget, ...fields });

  const addMetric = () => patch({ metrics: [...(widget.metrics ?? []), newMetric()] });
  const removeMetric = (mid: string) => patch({ metrics: widget.metrics?.filter((m) => m.id !== mid) });
  const updateMetric = (mid: string, fields: Partial<AnalysisMetric>) =>
    patch({ metrics: widget.metrics?.map((m) => (m.id === mid ? { ...m, ...fields } : m)) });

  const addDistItem = () =>
    patch({ distributionItems: [...(widget.distributionItems ?? []), { label: "New Item", value: 0, percentage: 0, color: "#1a3a5c" }] });
  const removeDistItem = (idx: number) =>
    patch({ distributionItems: widget.distributionItems?.filter((_, i) => i !== idx) });
  const updateDistItem = (idx: number, fields: Partial<typeof widget.distributionItems[0]>) =>
    patch({ distributionItems: widget.distributionItems?.map((d, i) => (i === idx ? { ...d, ...fields } : d)) });

  const addCompareRow = () =>
    patch({ compareItems: [...(widget.compareItems ?? []), { label: "New Row", values: ["", ""] }] });
  const removeCompareRow = (idx: number) =>
    patch({ compareItems: widget.compareItems?.filter((_, i) => i !== idx) });
  const updateCompareRow = (idx: number, fields: Partial<typeof widget.compareItems[0]>) =>
    patch({ compareItems: widget.compareItems?.map((c, i) => (i === idx ? { ...c, ...fields } : c)) });

  const addBarItem = () =>
    patch({ barData: [...(widget.barData ?? []), { label: "Item", value: 0, color: "#1a3a5c" }] });
  const removeBarItem = (idx: number) =>
    patch({ barData: widget.barData?.filter((_, i) => i !== idx) });
  const updateBarItem = (idx: number, fields: Partial<typeof widget.barData[0]>) =>
    patch({ barData: widget.barData?.map((b, i) => (i === idx ? { ...b, ...fields } : b)) });

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
      {/* Common fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Widget Title</label>
          <input
            type="text"
            value={widget.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            className="w-full border border-gray-300 px-3 py-1.5 text-[13px] focus:outline-none focus:border-gray-900"
            placeholder="Optional title"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Subtitle</label>
          <input
            type="text"
            value={widget.subtitle ?? ""}
            onChange={(e) => patch({ subtitle: e.target.value })}
            className="w-full border border-gray-300 px-3 py-1.5 text-[13px] focus:outline-none focus:border-gray-900"
            placeholder="Optional subtitle"
          />
        </div>
      </div>

      {/* Metric Card Editor */}
      {widget.type === "metric-card" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-gray-700">Metrics</span>
            <button onClick={addMetric} className="text-[11px] text-gray-900 font-medium hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Metric
            </button>
          </div>
          {(widget.metrics ?? []).map((m) => (
            <div key={m.id} className="bg-white border border-gray-200 rounded p-3 grid grid-cols-12 gap-2 items-end">
              <div className="col-span-3">
                <label className="block text-[10px] text-gray-500 mb-1">Label</label>
                <input value={m.label} onChange={(e) => updateMetric(m.id, { label: e.target.value })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-500 mb-1">Value</label>
                <input value={m.value} onChange={(e) => updateMetric(m.id, { value: e.target.value })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-500 mb-1">Unit</label>
                <input value={m.unit ?? ""} onChange={(e) => updateMetric(m.id, { unit: e.target.value })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-500 mb-1">Trend</label>
                <select value={m.trend ?? "neutral"} onChange={(e) => updateMetric(m.id, { trend: e.target.value as "up" | "down" | "neutral" })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] bg-white focus:outline-none focus:border-gray-900">
                  <option value="up">↑ Up</option>
                  <option value="down">↓ Down</option>
                  <option value="neutral">→ Neutral</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-500 mb-1">Trend Value</label>
                <input value={m.trendValue ?? ""} onChange={(e) => updateMetric(m.id, { trendValue: e.target.value })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" placeholder="+2.3%" />
              </div>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => removeMetric(m.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="col-span-12">
                <label className="block text-[10px] text-gray-500 mb-1">Note</label>
                <input value={m.note ?? ""} onChange={(e) => updateMetric(m.id, { note: e.target.value })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" placeholder="Optional note" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Distribution Editor */}
      {widget.type === "distribution" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-gray-700">Distribution Items</span>
            <button onClick={addDistItem} className="text-[11px] text-gray-900 font-medium hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
          {(widget.distributionItems ?? []).map((d, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded p-3 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1">
                <input type="color" value={d.color ?? "#1a3a5c"} onChange={(e) => updateDistItem(i, { color: e.target.value })}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
              </div>
              <div className="col-span-4">
                <input value={d.label} onChange={(e) => updateDistItem(i, { label: e.target.value })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" />
              </div>
              <div className="col-span-2">
                <input type="number" value={d.value} onChange={(e) => updateDistItem(i, { value: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" />
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-1">
                  <input type="number" value={d.percentage} onChange={(e) => updateDistItem(i, { percentage: Number(e.target.value) })}
                    className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" />
                  <span className="text-[12px] text-gray-400">%</span>
                </div>
              </div>
              <div className="col-span-2 flex justify-end">
                <button onClick={() => removeDistItem(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Table Editor */}
      {widget.type === "comparison" && (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Column Headers (comma-separated)</label>
            <input value={(widget.compareHeaders ?? []).join(", ")}
              onChange={(e) => patch({ compareHeaders: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              className="w-full border border-gray-300 px-3 py-1.5 text-[12px] focus:outline-none focus:border-gray-900"
              placeholder="Item, Value 1, Value 2, Mitigation" />
          </div>
          <div className="flex justify-end">
            <button onClick={addCompareRow} className="text-[11px] text-gray-900 font-medium hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Row
            </button>
          </div>
          {(widget.compareItems ?? []).map((c, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded p-3 flex gap-2 items-center">
              <div className="flex-1">
                <input value={c.label} onChange={(e) => updateCompareRow(i, { label: e.target.value })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" placeholder="Row label" />
              </div>
              {c.values.map((v, vi) => (
                <div key={vi} className="flex-1">
                  <input value={v} onChange={(e) => {
                    const newVals = [...c.values];
                    newVals[vi] = e.target.value;
                    updateCompareRow(i, { values: newVals });
                  }}
                    className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" placeholder={`Value ${vi + 1}`} />
                </div>
              ))}
              <button onClick={() => removeCompareRow(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Highlight / Callout Editor */}
      {widget.type === "highlight" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Callout Color</label>
              <input type="color" value={widget.calloutColor ?? "#1a3a5c"}
                onChange={(e) => patch({ calloutColor: e.target.value })}
                className="w-16 h-9 rounded border border-gray-300 cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Callout Text (supports markdown-style bold **text**)</label>
            <textarea rows={4} value={widget.text ?? ""}
              onChange={(e) => patch({ text: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 text-[13px] focus:outline-none focus:border-gray-900 resize-y"
              placeholder="Enter key insight text..." />
          </div>
        </div>
      )}

      {/* Bar Chart / Donut Chart Editor */}
      {(widget.type === "bar-chart" || widget.type === "donut-chart") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-gray-700">Data Items</span>
            <button onClick={addBarItem} className="text-[11px] text-gray-900 font-medium hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
          {(widget.barData ?? []).map((b, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded p-3 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1">
                <input type="color" value={b.color ?? "#1a3a5c"} onChange={(e) => updateBarItem(i, { color: e.target.value })}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
              </div>
              <div className="col-span-6">
                <input value={b.label} onChange={(e) => updateBarItem(i, { label: e.target.value })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" placeholder="Label" />
              </div>
              <div className="col-span-4">
                <input type="number" value={b.value} onChange={(e) => updateBarItem(i, { value: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-gray-900" placeholder="Value" />
              </div>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => removeBarItem(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Text Editor */}
      {widget.type === "custom-text" && (
        <div>
          <label className="block text-[10px] text-gray-500 mb-1">Custom HTML / Text Content</label>
          <textarea rows={4} value={widget.text ?? ""}
            onChange={(e) => patch({ text: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 text-[13px] focus:outline-none focus:border-gray-900 resize-y font-mono"
            placeholder="Enter custom text or HTML..." />
        </div>
      )}
    </div>
  );
}

function SectionEditor({
  section, onChange, onRemove,
}: {
  section: AnalysisSection;
  onChange: (s: AnalysisSection) => void;
  onRemove: () => void;
}) {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  const patch = (fields: Partial<AnalysisSection>) => onChange({ ...section, ...fields });

  const addWidget = (type: AnalysisWidgetType) => {
    const w = newWidget(type);
    patch({ widgets: [...section.widgets, w] });
    setActiveWidget(w.id);
  };

  const updateWidget = (wid: string, w: AnalysisWidget) =>
    patch({ widgets: section.widgets.map((widget) => (widget.id === wid ? w : widget)) });

  const removeWidget = (wid: string) => {
    patch({ widgets: section.widgets.filter((w) => w.id !== wid) });
    if (activeWidget === wid) setActiveWidget(null);
  };

  const moveWidget = (idx: number, dir: -1 | 1) => {
    const newWidgets = [...section.widgets];
    const target = idx + dir;
    if (target < 0 || target >= newWidgets.length) return;
    [newWidgets[idx], newWidgets[target]] = [newWidgets[target], newWidgets[idx]];
    patch({ widgets: newWidgets });
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Section Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <input
            value={section.title}
            onChange={(e) => patch({ title: e.target.value })}
            className="text-[14px] font-semibold text-gray-900 bg-transparent focus:outline-none focus:border-b focus:border-gray-900"
            placeholder="Section Title (EN)"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={section.sectionType}
            onChange={(e) => patch({ sectionType: e.target.value as AnalysisSection["sectionType"] })}
            className="border border-gray-300 px-2 py-1 text-[11px] bg-white focus:outline-none"
          >
            {SECTION_TYPES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={section.order}
            min={1}
            onChange={(e) => patch({ order: Number(e.target.value) })}
            className="w-14 border border-gray-300 px-2 py-1 text-[12px] text-center focus:outline-none"
            title="Display order"
          />
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-2 border-b border-gray-100">
        <input
          value={section.description ?? ""}
          onChange={(e) => patch({ description: e.target.value })}
          className="w-full text-[12px] text-gray-600 bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300"
          placeholder="Description (optional)"
        />
      </div>

      {/* Widgets List */}
      <div className="divide-y divide-gray-100">
        {section.widgets.map((w, idx) => (
          <div key={w.id}>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/50">
              <button onClick={() => moveWidget(idx, -1)} className="text-gray-400 hover:text-gray-600" title="Move up">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => moveWidget(idx, 1)} className="text-gray-400 hover:text-gray-600" title="Move down">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                w.type === "metric-card" ? "bg-blue-100 text-blue-700" :
                w.type === "distribution" ? "bg-purple-100 text-purple-700" :
                w.type === "highlight" ? "bg-amber-100 text-amber-700" :
                w.type === "comparison" ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {w.type}
              </span>
              {w.title && <span className="text-[12px] text-gray-700 font-medium">{w.title}</span>}
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setActiveWidget(activeWidget === w.id ? null : w.id)}
                  className="text-[11px] text-gray-900 font-medium hover:underline"
                >
                  {activeWidget === w.id ? "Collapse" : "Edit"}
                </button>
                <button onClick={() => removeWidget(w.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {activeWidget === w.id && (
              <div className="px-4 py-3">
                <WidgetEditor widget={w} onChange={(updated) => updateWidget(w.id, updated)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Widget */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {WIDGET_TYPES.map((wt) => (
            <button
              key={wt.value}
              onClick={() => addWidget(wt.value)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-medium border border-gray-300 bg-white hover:border-gray-900 hover:text-gray-900 rounded"
            >
              {wt.icon} Add {wt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalisisEditor({
  record, onBack, onSave, isNew,
}: {
  record: AnalisisDeskriptif | null;
  onBack: () => void;
  onSave: (data: Partial<AnalisisDeskriptif>) => void;
  isNew?: boolean;
}) {
  const [draft, setDraft] = useState<Partial<AnalisisDeskriptif>>(() =>
    record ? { ...record } : {
      title: "New Analysis",
      titleEn: "",
      description: "",
      descriptionEn: "",
      locale: "both",
      status: "active",
      sections: [],
    }
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record) setDraft({ ...record });
    else setDraft({
      title: "New Analysis",
      titleEn: "",
      description: "",
      descriptionEn: "",
      locale: "both",
      status: "active",
      sections: [],
    });
  }, [record?.id]);

  const patch = (fields: Partial<AnalisisDeskriptif>) => setDraft((prev) => ({ ...prev, ...fields }));

  const addSection = () => {
    const currentSections = draft.sections ?? [];
    patch({ sections: [...currentSections, newSection(currentSections.length + 1)] });
  };

  const updateSection = (idx: number, s: AnalysisSection) => {
    const updated = [...(draft.sections ?? [])];
    updated[idx] = s;
    patch({ sections: updated });
  };

  const removeSection = (idx: number) => {
    patch({ sections: (draft.sections ?? []).filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    if (!draft.title?.trim()) {
      setSaveError("Title is required.");
      return;
    }
    setSaveError(null);
    setIsSaving(true);
    onSave(draft);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
    }, 500);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-gray-300">·</span>
        <span className="text-[13px] font-medium text-gray-700">
          {isNew ? "New Analysis" : (draft.title ?? record?.title ?? "Edit")}
        </span>
        {draft.status && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            draft.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {draft.status.toUpperCase()}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Identity */}
        <div className="bg-white border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-4 pb-3 border-b border-[#E5E7EB]">
              Analysis Identity
            </div>
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title (EN)</label>
            <input type="text" value={draft.title ?? ""}
              onChange={(e) => patch({ title: e.target.value })}
              className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title (ID)</label>
            <input type="text" value={draft.titleEn ?? ""}
              onChange={(e) => patch({ titleEn: e.target.value })}
              className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea rows={2} value={draft.description ?? ""}
              onChange={(e) => patch({ description: e.target.value })}
              className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-gray-900 resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Language Scope</label>
            <div className="flex gap-2">
              {(["both", "en", "id"] as const).map((l) => (
                <button key={l} onClick={() => patch({ locale: l })}
                  className={`px-4 py-2 text-[12px] font-semibold border capitalize ${
                    draft.locale === l ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}>
                  {l === "both" ? "EN + ID" : l === "en" ? "English Only" : "Indonesian Only"}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
            <div className="flex gap-2">
              {(["active", "archived"] as const).map((s) => (
                <button key={s} onClick={() => patch({ status: s })}
                  className={`px-4 py-2 text-[12px] font-semibold border capitalize ${
                    draft.status === s ? (s === "active" ? "bg-green-700 text-white border-green-700" : "bg-gray-500 text-white border-gray-500") : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-semibold text-gray-900">Sections</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {(draft.sections ?? []).length} section{(draft.sections ?? []).length !== 1 ? "s" : ""} —
                Drag to reorder widgets within each section
              </p>
            </div>
            <button onClick={addSection}
              className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-4 py-2 hover:bg-gray-700">
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>

          <div className="space-y-6">
            {(draft.sections ?? []).sort((a, b) => a.order - b.order).map((section, idx) => (
              <SectionEditor
                key={section.id}
                section={section}
                onChange={(s) => updateSection(idx, s)}
                onRemove={() => removeSection(idx)}
              />
            ))}
          </div>

          {(draft.sections ?? []).length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
              <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-[14px] text-gray-500 mb-3">No sections yet.</p>
              <button onClick={addSection}
                className="text-[13px] font-medium text-gray-900 hover:underline">
                + Add your first section
              </button>
            </div>
          )}
        </div>

        {/* Save */}
        {saveError && (
          <div className="flex items-start gap-2 text-[12.5px] text-red-700 bg-red-50 border border-red-200 px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{saveError}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-5 py-2 hover:bg-gray-700 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving…" : "Save Analysis"}
          </button>
          {saved && (
            <span className="text-[12px] text-green-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Saved successfully
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalisisTab() {
  const { data: records = [], isLoading } = useAnalisisList();
  const createMut = useCreateAnalisis();
  const updateMut = useUpdateAnalisis();
  const deleteMut = useDeleteAnalisis();
  const resetMut = useResetAnalisis();

  const [editRecord, setEditRecord] = useState<AnalisisDeskriptif | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleCreate = () => {
    setEditRecord(null);
    setIsNew(true);
  };

  const handleSave = (data: Partial<AnalisisDeskriptif>) => {
    if (isNew) {
      createMut.mutate(data as Omit<AnalisisDeskriptif, "id" | "createdAt" | "updatedAt">, {
        onSuccess: () => {
          setIsNew(false);
          setEditRecord(null);
        },
      });
    } else if (editRecord?.id) {
      updateMut.mutate({ id: editRecord.id, data }, {
        onSuccess: () => {
          setEditRecord(null);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this analysis record? This cannot be undone.")) return;
    deleteMut.mutate(id, { onSuccess: () => {
      if (editRecord?.id === id) {
        setEditRecord(null);
        setIsNew(false);
      }
    }});
  };

  const handleReset = () => {
    if (!confirm("Reset all analysis to seed state? All custom edits will be lost.")) return;
    resetMut.mutate(undefined, { onSuccess: () => setEditRecord(null) });
  };

  if (editRecord !== null || isNew) {
    return (
      <AnalisisEditor
        record={isNew ? null : editRecord}
        isNew={isNew}
        onBack={() => { setEditRecord(null); setIsNew(false); }}
        onSave={handleSave}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-900">Analisis Deskriptif</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {isLoading ? "Loading…" : `${records.length} analysis record${records.length !== 1 ? "s" : ""} — customizable descriptive analysis sections`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} disabled={resetMut.isPending}
            className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50">
            {resetMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Reset to Seed
          </button>
          <button onClick={handleCreate}
            className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-4 py-2 hover:bg-gray-700">
            <Plus className="w-4 h-4" /> New Analysis
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-[13.5px]">Loading…</span>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
          <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-[14px] text-gray-500 mb-3">No analysis records found.</p>
          <button onClick={handleCreate} className="text-[13px] font-medium text-gray-900 hover:underline">
            + Create your first analysis
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <div key={r.id} className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-semibold text-gray-900">{r.title}</h3>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        r.locale === "both" ? "bg-blue-100 text-blue-700" :
                        r.locale === "en" ? "bg-gray-800 text-white" : "bg-gray-700 text-white"
                      }`}>
                        {r.locale === "both" ? "EN+ID" : r.locale.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-500">{r.description || "No description"}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {r.sections.length} section{r.sections.length !== 1 ? "s" : ""} ·
                      Last updated: {new Date(r.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setEditRecord(r); setIsNew(false); }}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-gray-900 border border-gray-900 px-3 py-1.5 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section Preview */}
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                <div className="flex flex-wrap gap-2">
                  {r.sections.sort((a, b) => a.order - b.order).map((s) => (
                    <div key={s.id} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded px-2.5 py-1">
                      <span className="text-[10px] font-bold text-gray-400">#{s.order}</span>
                      <span className="text-[11.5px] font-medium text-gray-700">{s.title || "Untitled"}</span>
                      <span className="text-[10px] text-gray-400">({s.widgets.length} widget{s.widgets.length !== 1 ? "s" : ""})</span>
                      <span className={`text-[9px] px-1 py-0.5 rounded ${
                        s.sectionType === "overview" ? "bg-blue-50 text-blue-600" :
                        s.sectionType === "dataset-breakdown" ? "bg-purple-50 text-purple-600" :
                        s.sectionType === "blog-insights" ? "bg-green-50 text-green-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {s.sectionType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
        <Star className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12.5px] font-semibold text-blue-800 mb-1">Customizable Descriptive Analysis</p>
          <p className="text-[12px] text-blue-700 leading-relaxed">
            Each analysis record supports multiple sections. Each section can contain multiple widgets:
            <strong> Metric Cards</strong> (KPI with trends), <strong>Distribution Charts</strong> (donut/bar),
            <strong> Comparison Tables</strong>, <strong>Highlight Callouts</strong>, <strong>Bar Charts</strong>,
            and <strong>Custom Text</strong>. Edit widgets inline, reorder with ↑↓ buttons, and preview changes live.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminPage ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"data" | "pages" | "blog" | "analisis" | "featured">("data");

  const tabs = [
    { key: "data" as const,      label: "Data Hub",           icon: <Database className="w-4 h-4" /> },
    { key: "pages" as const,      label: "Pages",              icon: <FileText className="w-4 h-4" /> },
    { key: "blog" as const,       label: "Blog",               icon: <BookOpen className="w-4 h-4" /> },
    { key: "analisis" as const,   label: "Analisis Deskriptif",  icon: <BarChart3 className="w-4 h-4" /> },
    { key: "featured" as const,    label: "Featured Insights",   icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[15px] font-semibold text-gray-900">AndaraLab CMS</span>
          <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium border transition-colors ${
                  activeTab === t.key
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <a href="/" className="text-[12.5px] text-gray-500 hover:text-gray-800 font-medium">← Back to site</a>
      </div>

      {/* ── Tab content ───────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {activeTab === "data"      && <DataHubTab />}
        {activeTab === "pages"     && <PagesTab />}
        {activeTab === "blog"      && <BlogTab />}
        {activeTab === "analisis"  && <AnalisisTab />}
        {activeTab === "featured"  && <FeaturedInsightsTab />}
      </div>
    </div>
  );
}
