import { useState } from "react";
import {
  useDatasets, useCreateDataset, useUpdateDataset,
  useDeleteDataset, useResetDatasets,
  usePages, useCreatePage, useUpdatePage, useDeletePage, useResetPages,
  usePosts, useCreatePost, useUpdatePost, useDeletePost, useResetPosts,
  type ChartDataset, type Page, type BlogPost,
} from "@/lib/cms-store";
import InteractiveChart from "@/components/InteractiveChart";
import {
  Plus, Trash2, Save, ChevronLeft, BarChart2, LineChart,
  TrendingUp, AlertCircle, CheckCircle, Loader2, RefreshCw,
  Database, FileText, BookOpen, ChevronDown, ChevronRight,
  Globe, Eye, EyeOff, Link2, Unlink,
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

function newPage(locale: "en" | "id" = "en"): Omit<Page, "id" | "createdAt" | "updatedAt"> {
  return {
    slug: "/new-page",
    locale,
    status: "draft",
    title: "New Page",
    description: "",
    content: [],
    navLabel: "",
    section: "root",
  };
}

function newPost(locale: "en" | "id" = "en"): Omit<BlogPost, "id" | "createdAt" | "updatedAt"> {
  return {
    slug: "new-post",
    locale,
    status: "draft",
    title: "New Post",
    excerpt: "",
    body: [""],
    category: "economics-101",
    tag: "",
    readTime: "5 min read",
  };
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
              tab === t ? "border-[#1a3a5c] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"
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
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] resize-none" />
              ) : (
                <input type="text" value={(effective as any)[field] ?? ""}
                  onChange={(e) => patch({ [field]: e.target.value })}
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c]" />
              )}
            </div>
          ))}
          <div>
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
            <select value={effective.category}
              onChange={(e) => patch({ category: e.target.value })}
              className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] bg-white">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Chart Type</label>
            <div className="flex gap-2">
              {(["line", "bar", "area"] as const).map((t) => (
                <button key={t} onClick={() => patch({ chartType: t })}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium border capitalize ${effective.chartType === t ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-[#E5E7EB] text-gray-600 hover:border-gray-400"}`}>
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
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] resize-none" />
              ) : (
                <input type="text" value={(effective as any)[field] ?? ""}
                  onChange={(e) => patch({ [field]: e.target.value })}
                  className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c]" />
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
              <button onClick={addRow} className="flex items-center gap-1 text-[12px] font-medium text-white bg-[#1a3a5c] px-3 py-1.5 hover:bg-[#14305a]">
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
  page, onBack, isNew,
}: {
  page: Page | null;
  onBack: () => void;
  isNew?: boolean;
}) {
  const updateMut = useUpdatePage();
  const createMut = useCreatePage();
  const isSaving = updateMut.isPending || createMut.isPending;
  const [draft, setDraft] = useState<Partial<Page>>(page ?? {});
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const isUpdating = draft !== null && !isNew;

  const handleSave = () => {
    if (!draft) return;
    if (isNew) {
      createMut.mutate(draft as any, {
        onSuccess: (res: any) => {
          setSavedSlug(res.data?.slug ?? draft.slug ?? null);
        },
      });
    } else if (page?.id) {
      updateMut.mutate({ id: page.id, data: draft }, {
        onSuccess: () => {
          setSavedSlug(draft.slug ?? page.slug ?? null);
        },
      });
    }
  };

  const patch = (fields: Partial<Page>) => setDraft((prev) => ({ ...prev, ...fields }));

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
        {page && <StatusBadge status={page.status} />}
        {page && <LocaleBadge locale={page.locale} />}
      </div>

      <div className="bg-white border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="md:col-span-2">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-4 pb-3 border-b border-[#E5E7EB]">Page Identity</div>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Slug (URL path)</label>
          <input type="text" value={draft.slug ?? ""}
            onChange={(e) => patch({ slug: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] font-mono" />
          <p className="text-[10.5px] text-gray-400 mt-1">e.g. /macro/macro-outlooks or /about</p>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Language</label>
          <div className="flex gap-2">
            {(["en", "id"] as const).map((l) => (
              <button key={l} onClick={() => patch({ locale: l })}
                className={`px-4 py-2 text-[12.5px] font-semibold border capitalize ${
                  draft.locale === l ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
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
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[#1a3a5c]" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Meta Description (SEO)</label>
          <textarea rows={2} value={draft.description ?? ""}
            onChange={(e) => patch({ description: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] resize-none" />
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Navigation Label</label>
          <input type="text" value={draft.navLabel ?? ""}
            onChange={(e) => patch({ navLabel: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c]" />
          <p className="text-[10.5px] text-gray-400 mt-1">Short label shown in the top navigation bar</p>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Section</label>
          <select value={draft.section ?? "root"}
            onChange={(e) => patch({ section: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] bg-white">
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
          <div className="flex gap-2">
            {(["draft", "published"] as const).map((s) => (
              <button key={s} onClick={() => patch({ status: s })}
                className={`px-4 py-2 text-[12.5px] font-semibold border capitalize ${
                  draft.status === s ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                }`}>
                {s === "published" ? "Published (live)" : "Draft (hidden)"}
              </button>
            ))}
          </div>
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

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#1a3a5c] px-5 py-2 hover:bg-[#14305a] disabled:opacity-50">
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
          <div className="flex items-center gap-3">
            <a
              href={savedSlug}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-medium text-[#1a3a5c] underline"
            >
              View on site → {window.location.origin}{savedSlug}
            </a>
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
  post, onBack, isNew,
}: {
  post: BlogPost | null;
  onBack: () => void;
  isNew?: boolean;
}) {
  const updateMut = useUpdatePost();
  const createMut = useCreatePost();
  const isSaving = updateMut.isPending || createMut.isPending;
  const [draft, setDraft] = useState<Partial<BlogPost>>(post ?? {});
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const handleSave = () => {
    if (!draft) return;
    if (isNew) {
      createMut.mutate(draft as any, {
        onSuccess: (res: any) => {
          setSavedSlug(res.data?.slug ?? draft.slug ?? null);
        },
      });
    } else if (post?.id) {
      updateMut.mutate({ id: post.id, data: draft }, {
        onSuccess: () => {
          setSavedSlug(draft.slug ?? post.slug ?? null);
        },
      });
    }
  };

  const patch = (fields: Partial<BlogPost>) => setDraft((prev) => ({ ...prev, ...fields }));

  const bodyLines = Array.isArray(draft.body) ? draft.body : [""];
  const setBodyLines = (lines: string[]) => patch({ body: lines });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-gray-300">·</span>
        <span className="text-[13px] font-medium text-gray-700">
          {isNew ? "New Blog Post" : (draft.title ?? post?.title ?? "Untitled")}
        </span>
        {post && <StatusBadge status={post.status} />}
        {post && <LocaleBadge locale={post.locale} />}
      </div>

      <div className="bg-white border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="md:col-span-2">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-4 pb-3 border-b border-[#E5E7EB]">Post Identity</div>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Slug</label>
          <input type="text" value={draft.slug ?? ""}
            onChange={(e) => patch({ slug: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] font-mono" />
          <p className="text-[10.5px] text-gray-400 mt-1">URL slug, e.g. my-post-title</p>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Language</label>
          <div className="flex gap-2">
            {(["en", "id"] as const).map((l) => (
              <button key={l} onClick={() => patch({ locale: l })}
                className={`px-4 py-2 text-[12.5px] font-semibold border capitalize ${
                  draft.locale === l ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
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
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[#1a3a5c]" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Excerpt</label>
          <textarea rows={2} value={draft.excerpt ?? ""}
            onChange={(e) => patch({ excerpt: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] resize-none" />
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
          <select value={draft.category ?? "economics-101"}
            onChange={(e) => patch({ category: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] bg-white">
            {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tag</label>
          <input type="text" value={draft.tag ?? ""}
            onChange={(e) => patch({ tag: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c]" />
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Read Time</label>
          <input type="text" value={draft.readTime ?? ""}
            onChange={(e) => patch({ readTime: e.target.value })}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c]"
            placeholder="e.g. 5 min read" />
        </div>

        <div>
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
          <div className="flex gap-2">
            {(["draft", "published"] as const).map((s) => (
              <button key={s} onClick={() => patch({ status: s })}
                className={`px-4 py-2 text-[12.5px] font-semibold border capitalize ${
                  draft.status === s ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                }`}>
                {s === "published" ? "Published" : "Draft"}
              </button>
            ))}
          </div>
        </div>

        {/* Body editor */}
        <div className="md:col-span-2">
          <label className="block text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Body — Paragraphs (one per line)
          </label>
          <textarea rows={bodyLines.length + 2} value={bodyLines.join("\n")}
            onChange={(e) => setBodyLines(e.target.value.split("\n"))}
            className="w-full border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#1a3a5c] resize-y font-mono leading-relaxed"
            placeholder="Enter paragraph text… Each line becomes a new paragraph." />
          <p className="text-[10.5px] text-gray-400 mt-1">{bodyLines.length} paragraph{bodyLines.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#1a3a5c] px-5 py-2 hover:bg-[#14305a] disabled:opacity-50">
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
          <div className="flex items-center gap-3">
            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-medium text-[#1a3a5c] underline"
            >
              View on site → {window.location.origin}/blog
            </a>
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
                className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#1a3a5c] px-4 py-2 hover:bg-[#14305a]">
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
                    <button onClick={() => openEdit(ds)} className="text-[12px] font-medium text-[#1a3a5c] hover:underline">Edit</button>
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
          <a href="/admin" className="text-[12px] text-[#1a3a5c] underline">Refresh list</a>
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
            className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#1a3a5c] px-4 py-2 hover:bg-[#14305a]">
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
              localeFilter === v ? "border-[#1a3a5c] bg-[#1a3a5c] text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{label}</button>
        ))}
        <div className="h-4 w-px bg-gray-200 mx-1" />
        {[["all", "All"], ["published", "Published"], ["draft", "Draft"]].map(([v, label]) => (
          <button key={v} onClick={() => setStatusFilter(v)}
            className={`px-3 py-1 text-[12px] font-medium border ${
              statusFilter === v ? "border-[#1a3a5c] bg-[#1a3a5c] text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
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
                    <button onClick={() => openEdit(anyPage)} className="text-[12px] font-medium text-[#1a3a5c] hover:underline">Edit</button>
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
                      <button onClick={() => openEdit(p)} className="text-[12px] font-medium text-[#1a3a5c] hover:underline">Edit</button>
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
          <a href="/admin" className="text-[12px] text-[#1a3a5c] underline">Refresh list</a>
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
          <button onClick={() => { setEditPost(null as any); setIsNewPost(true); }}
            className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#1a3a5c] px-4 py-2 hover:bg-[#14305a]">
            <Plus className="w-4 h-4" /> New Post (EN)
          </button>
          <button onClick={() => { const p = newPost("id"); setEditPost(p as any); setIsNewPost(true); }}
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
              localeFilter === v ? "border-[#1a3a5c] bg-[#1a3a5c] text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{label}</button>
        ))}
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <span className="text-[11.5px] text-gray-500 font-medium">Status:</span>
        {[["all", "All"], ["published", "Published"], ["draft", "Draft"]].map(([v, label]) => (
          <button key={v} onClick={() => setStatusFilter(v)}
            className={`px-3 py-1 text-[12px] font-medium border ${
              statusFilter === v ? "border-[#1a3a5c] bg-[#1a3a5c] text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{label}</button>
        ))}
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <span className="text-[11.5px] text-gray-500 font-medium">Category:</span>
        {[["all", "All"], ...BLOG_CATEGORIES.map((c) => [c, c] as [string, string])].map(([v, label]) => (
          <button key={v} onClick={() => setCategoryFilter(v)}
            className={`px-3 py-1 text-[12px] font-medium border ${
              categoryFilter === v ? "border-[#1a3a5c] bg-[#1a3a5c] text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"
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
                      className="text-[12px] font-medium text-[#1a3a5c] hover:underline">Edit</button>
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
                        className="text-[12px] font-medium text-[#1a3a5c] hover:underline">Edit</button>
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

// ─── Main AdminPage ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"data" | "pages" | "blog">("data");

  const tabs = [
    { key: "data" as const,  label: "Data Hub",  icon: <Database className="w-4 h-4" /> },
    { key: "pages" as const, label: "Pages",     icon: <FileText className="w-4 h-4" /> },
    { key: "blog" as const,  label: "Blog",       icon: <BookOpen className="w-4 h-4" /> },
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
                    ? "border-[#1a3a5c] bg-[#1a3a5c] text-white"
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
        {activeTab === "data"  && <DataHubTab />}
        {activeTab === "pages" && <PagesTab />}
        {activeTab === "blog"  && <BlogTab />}
      </div>
    </div>
  );
}
