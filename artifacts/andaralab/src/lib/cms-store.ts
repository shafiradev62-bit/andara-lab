// cms-store.ts — Dataset API layer + TanStack Query hooks
//
// Architecture:
// - localStorage is no longer the source of truth.
//   It is used only as a **client-side cache fallback** when the API is unreachable
//   (e.g., API server not running during development).
// - All data operations go through the REST API (/api/datasets).
// - TanStack Query handles caching, loading states, background refetch, and
//   optimistic updates via useMutation + queryClient.setQueryData.
//
// To switch to a real database: replace the in-memory store in api-server with
// Drizzle ORM + PostgreSQL — no changes needed in this file.
//
// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartDataset {
  id: string;
  title: string;
  description: string;
  category: string;
  chartType: "line" | "bar" | "area";
  color: string;
  unit: string;
  // CMS-editable chart metadata
  chartTitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  subtitle?: string;
  columns: string[];
  rows: Record<string, string | number>[];
  createdAt: string;
  updatedAt: string;
}

// ─── Content Section (matches DB schema) ────────────────────────────────────────

export type ContentSection =
  | { type: "text";      content: string }
  | { type: "hero";      headline: string; subheadline?: string; ctaText?: string; ctaHref?: string }
  | { type: "stats";     items: { label: string; value: string; unit?: string }[] }
  | { type: "featured";  slugs: string[]; limit?: number }
  | { type: "chart";     datasetId: string; title?: string }
  | { type: "cta";       heading: string; body: string; buttonText: string; buttonHref: string }
  | { type: "divider" };

// ─── Page Type ──────────────────────────────────────────────────────────────────

export interface Page {
  id: number;
  slug: string;
  locale: "en" | "id";
  status: "draft" | "published";
  title: string;
  description?: string;
  content: ContentSection[];
  linkedId?: string;
  linkedIdRecord?: Page | null;
  navLabel?: string;
  section?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog Post Type ────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  slug: string;
  locale: "en" | "id";
  status: "draft" | "published";
  title: string;
  excerpt?: string;
  body: string[];
  category: string;
  tag?: string;
  image?: string;
  readTime?: string;
  linkedId?: string;
  linkedIdRecord?: BlogPost | null;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API functions ─────────────────────────────────────────────────────────────
//
// These mirror the original localStorage functions but hit the REST API.
// They return raw data (hooks handle loading/error states).

import {
  apiGet, apiPost, apiPut, apiDelete,
  type ApiListResponse, type ApiSingleResponse,
} from "./api";

export async function fetchDatasets(category?: string): Promise<ChartDataset[]> {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await apiGet<ApiListResponse<ChartDataset>>(`/api/datasets${params}`);
  return res.data;
}

export async function fetchDataset(id: string): Promise<ChartDataset> {
  const res = await apiGet<ApiSingleResponse<ChartDataset>>(`/api/datasets/${id}`);
  return res.data;
}

export async function createDataset(
  data: Omit<ChartDataset, "id" | "createdAt" | "updatedAt">
): Promise<ChartDataset> {
  const res = await apiPost<ApiSingleResponse<ChartDataset>>("/api/datasets", data);
  return res.data;
}

export async function updateDataset(
  id: string,
  data: Partial<Omit<ChartDataset, "id" | "createdAt" | "updatedAt">>
): Promise<ChartDataset> {
  const res = await apiPut<ApiSingleResponse<ChartDataset>>(`/api/datasets/${id}`, data);
  return res.data;
}

export async function deleteDatasetAPI(id: string): Promise<void> {
  return apiDelete(`/api/datasets/${id}`);
}

export async function resetDatasets(): Promise<ChartDataset[]> {
  const res = await apiPost<ApiListResponse<ChartDataset>>("/api/datasets/reset", {});
  return res.data;
}

export async function fetchCategories(): Promise<string[]> {
  const res = await apiGet<{ data: string[] }>("/api/datasets/categories");
  return res.data;
}

// ─── Pages API ──────────────────────────────────────────────────────────────────

interface PagesApiResponse {
  data: Page[];
  meta: { total: number; locale: string; status: string };
}

interface PageApiResponse {
  data: Page;
  meta?: { created?: boolean; updated?: boolean };
}

export async function fetchPages(filter?: { locale?: string; status?: string; section?: string }): Promise<Page[]> {
  const params = new URLSearchParams();
  if (filter?.locale)  params.set("locale",  filter.locale);
  if (filter?.status)  params.set("status",  filter.status);
  if (filter?.section) params.set("section", filter.section);
  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await apiGet<PagesApiResponse>(`/api/pages${qs}`);
  return res.data;
}

export async function fetchPage(id: number): Promise<Page> {
  const res = await apiGet<PageApiResponse>(`/api/pages/${id}`);
  return res.data;
}

export async function fetchPageBySlug(slug: string, locale?: string): Promise<Page> {
  const params = locale ? `?locale=${locale}` : "";
  const res = await apiGet<PageApiResponse>(`/api/pages/slug/${encodeURIComponent(slug)}${params}`);
  return res.data;
}

export async function createPage(data: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<Page> {
  const res = await apiPost<PageApiResponse>("/api/pages", data);
  return res.data;
}

export async function updatePage(id: number, data: Partial<Omit<Page, "id" | "createdAt" | "updatedAt">>): Promise<Page> {
  const res = await apiPut<PageApiResponse>(`/api/pages/${id}`, data);
  return res.data;
}

export async function deletePageAPI(id: number): Promise<void> {
  return apiDelete(`/api/pages/${id}`);
}

export async function resetPages(): Promise<Page[]> {
  const res = await apiPost<PagesApiResponse>("/api/pages/reset", {});
  return res.data;
}

export async function linkPages(idA: number, idB: number): Promise<void> {
  await apiPost("/api/pages/link", { idA, idB });
}

// ─── Blog Posts API ─────────────────────────────────────────────────────────────

interface PostsApiResponse {
  data: BlogPost[];
  meta: { total: number; locale: string; status: string; category: string };
}

interface PostApiResponse {
  data: BlogPost;
  meta?: { created?: boolean; updated?: boolean };
}

export async function fetchPosts(filter?: { locale?: string; status?: string; category?: string }): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  if (filter?.locale)   params.set("locale",   filter.locale);
  if (filter?.status)   params.set("status",   filter.status);
  if (filter?.category) params.set("category",  filter.category);
  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await apiGet<PostsApiResponse>(`/api/blog${qs}`);
  return res.data;
}

export async function fetchPost(id: number): Promise<BlogPost> {
  const res = await apiGet<PostApiResponse>(`/api/blog/${id}`);
  return res.data;
}

export async function createPost(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
  const res = await apiPost<PostApiResponse>("/api/blog", data);
  return res.data;
}

export async function updatePost(id: number, data: Partial<Omit<BlogPost, "id" | "createdAt" | "updatedAt">>): Promise<BlogPost> {
  const res = await apiPut<PostApiResponse>(`/api/blog/${id}`, data);
  return res.data;
}

export async function deletePostAPI(id: number): Promise<void> {
  return apiDelete(`/api/blog/${id}`);
}

export async function resetPosts(): Promise<BlogPost[]> {
  const res = await apiPost<PostsApiResponse>("/api/blog/reset", {});
  return res.data;
}

export async function linkPosts(idA: number, idB: number): Promise<void> {
  await apiPost("/api/blog/link", { idA, idB });
}

// ─── TanStack Query hooks ────────────────────────────────────────────────────────
//
// Pages import these instead of calling the API functions directly.
// Hooks handle: loading state, error state, cache invalidation on mutations,
// and background refetching.
//
// Query keys follow the pattern: ["entity", "action", ...identifiers]
// This makes invalidation granular (e.g., invalidate ["datasets"] to refetch all lists).

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const QUERY_KEY = {
  datasets:    ["datasets"] as const,
  dataset:     (id: string) => ["dataset", id] as const,
  categories:  ["categories"] as const,
  pages:       ["pages"] as const,
  page:        (id: number) => ["page", id] as const,
  posts:       ["posts"] as const,
  post:        (id: number) => ["post", id] as const,
};

// useDatasets — fetch all datasets (optionally filtered by category)
export function useDatasets(category?: string) {
  return useQuery({
    queryKey: category ? [...QUERY_KEY.datasets, { category }] : QUERY_KEY.datasets,
    queryFn:  () => fetchDatasets(category),
    staleTime: 1000 * 60 * 5,
  });
}

// useDataset — fetch a single dataset by ID
export function useDataset(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEY.dataset(id ?? ""),
    queryFn:  () => fetchDataset(id!),
    enabled:  Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

// useCategories — fetch unique categories
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEY.categories,
    queryFn:  fetchCategories,
    staleTime: 1000 * 60 * 30, // categories change rarely
  });
}

// ─── Mutation hooks ─────────────────────────────────────────────────────────────
//
// Each mutation invalidates the datasets list query so the UI stays in sync.

export function useCreateDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDataset,
    onSuccess: () => {
      // Invalidate list so it refetches and includes the new entry
      qc.invalidateQueries({ queryKey: QUERY_KEY.datasets });
    },
  });
}

export function useUpdateDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateDataset>[1] }) =>
      updateDataset(id, data),
    onMutate: async ({ id, data }) => {
      // Optimistic update: immediately show the change in the UI
      await qc.cancelQueries({ queryKey: QUERY_KEY.dataset(id) });
      const previous = qc.getQueryData<ChartDataset>(QUERY_KEY.dataset(id));
      qc.setQueryData<ChartDataset>(QUERY_KEY.dataset(id), (old) =>
        old ? { ...old, ...data } : old
      );
      return { previous };
    },
    onError: (_err, { id }, context) => {
      // Roll back optimistic update on error
      if (context?.previous) {
        qc.setQueryData(QUERY_KEY.dataset(id), context.previous);
      }
    },
    onSettled: (_data, _err, { id }) => {
      // Always refetch after mutation to ensure server state is reflected
      qc.invalidateQueries({ queryKey: QUERY_KEY.dataset(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEY.datasets });
    },
  });
}

export function useDeleteDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDatasetAPI,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.datasets });
    },
  });
}

export function useResetDatasets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resetDatasets,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.datasets });
    },
  });
}

// ─── Pages hooks ────────────────────────────────────────────────────────────────

export function usePages(filter?: { locale?: string; status?: string; section?: string }) {
  return useQuery({
    queryKey: filter ? [...QUERY_KEY.pages, filter] : QUERY_KEY.pages,
    queryFn:  () => fetchPages(filter),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePage(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEY.page(id ?? 0),
    queryFn:  () => fetchPage(id!),
    enabled:  Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.pages });
    },
  });
}

export function useUpdatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updatePage>[1] }) =>
      updatePage(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: QUERY_KEY.page(id) });
      const previous = qc.getQueryData<Page>(QUERY_KEY.page(id));
      qc.setQueryData<Page>(QUERY_KEY.page(id), (old) => old ? { ...old, ...data } : old);
      return { previous };
    },
    onError: (_err, { id }, context) => {
      if (context?.previous) qc.setQueryData(QUERY_KEY.page(id), context.previous);
    },
    onSettled: (_data, _err, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.page(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEY.pages });
    },
  });
}

export function useDeletePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePageAPI,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.pages });
    },
  });
}

export function useResetPages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resetPages,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.pages });
    },
  });
}

// ─── Blog posts hooks ──────────────────────────────────────────────────────────

export function usePosts(filter?: { locale?: string; status?: string; category?: string }) {
  return useQuery({
    queryKey: filter ? [...QUERY_KEY.posts, filter] : QUERY_KEY.posts,
    queryFn:  () => fetchPosts(filter),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePost(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEY.post(id ?? 0),
    queryFn:  () => fetchPost(id!),
    enabled:  Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.posts });
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updatePost>[1] }) =>
      updatePost(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: QUERY_KEY.post(id) });
      const previous = qc.getQueryData<BlogPost>(QUERY_KEY.post(id));
      qc.setQueryData<BlogPost>(QUERY_KEY.post(id), (old) => old ? { ...old, ...data } : old);
      return { previous };
    },
    onError: (_err, { id }, context) => {
      if (context?.previous) qc.setQueryData(QUERY_KEY.post(id), context.previous);
    },
    onSettled: (_data, _err, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.post(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEY.posts });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePostAPI,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.posts });
    },
  });
}

export function useResetPosts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resetPosts,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.posts });
    },
  });
}

// ─── Legacy compatibility layer ─────────────────────────────────────────────────
//
// The original localStorage-based functions are kept so existing code
// (e.g. non-React contexts) continues to work without changes.
// New code should prefer the query hooks above.

const STORAGE_KEY = "andaralab_cms_datasets";

export function loadDatasets(): ChartDataset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveDatasets(datasets: ChartDataset[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets));
}
