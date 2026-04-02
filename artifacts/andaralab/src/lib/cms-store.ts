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
  | { type: "posts";     categories: string[]; title?: string }
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
// FALLBACK: If API is unavailable (e.g., Vercel production without backend),
// we fall back to localStorage with seed data.

import {
  apiGet, apiPost, apiPut, apiDelete,
  type ApiListResponse, type ApiSingleResponse,
} from "./api";
import {
  getSeedDatasets, getSeedPages, getSeedPosts,
  saveDatasetsToStorage, savePagesToStorage, savePostsToStorage,
  resetDatasetsToSeed, resetPagesToSeed, resetPostsToSeed,
} from "./seed-data-frontend";

export async function fetchDatasets(category?: string): Promise<ChartDataset[]> {
  try {
    const params = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await apiGet<ApiListResponse<ChartDataset>>(`/api/datasets${params}`);
    // Save to localStorage as cache
    saveDatasetsToStorage(res.data);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, using seed data:', error);
    // Fallback to seed data from localStorage
    const seedData = getSeedDatasets();
    return category 
      ? seedData.filter(d => d.category === category)
      : seedData;
  }
}

export async function fetchDataset(id: string): Promise<ChartDataset> {
  try {
    const res = await apiGet<ApiSingleResponse<ChartDataset>>(`/api/datasets/${id}`);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, fetching from seed:', error);
    const seedData = getSeedDatasets();
    const found = seedData.find(d => d.id === id);
    if (!found) throw new Error(`Dataset ${id} not found`);
    return found;
  }
}

export async function createDataset(
  data: Omit<ChartDataset, "id" | "createdAt" | "updatedAt">
): Promise<ChartDataset> {
  try {
    const res = await apiPost<ApiSingleResponse<ChartDataset>>("/api/datasets", data);
    // Also update localStorage cache
    const currentDatasets = getSeedDatasets();
    saveDatasetsToStorage([...currentDatasets, res.data]);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, saving to localStorage only:', error);
    // Fallback: save to localStorage only
    const newDataset: ChartDataset = {
      ...data,
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const currentDatasets = getSeedDatasets();
    saveDatasetsToStorage([...currentDatasets, newDataset]);
    return newDataset;
  }
}

export async function updateDataset(
  id: string,
  data: Partial<Omit<ChartDataset, "id" | "createdAt" | "updatedAt">>
): Promise<ChartDataset> {
  try {
    const res = await apiPut<ApiSingleResponse<ChartDataset>>(`/api/datasets/${id}`, data);
    // Also update localStorage cache
    const currentDatasets = getSeedDatasets();
    const updated = currentDatasets.map(d => d.id === id ? { ...d, ...data } : d);
    saveDatasetsToStorage(updated as ChartDataset[]);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, updating localStorage only:', error);
    // Fallback: update localStorage only
    const currentDatasets = getSeedDatasets();
    const index = currentDatasets.findIndex(d => d.id === id);
    if (index === -1) throw new Error(`Dataset ${id} not found`);
    const updated = { ...currentDatasets[index], ...data, updatedAt: new Date().toISOString() } as ChartDataset;
    currentDatasets[index] = updated;
    saveDatasetsToStorage(currentDatasets);
    return updated;
  }
}

export async function deleteDatasetAPI(id: string): Promise<void> {
  try {
    await apiDelete(`/api/datasets/${id}`);
    // Also remove from localStorage cache
    const currentDatasets = getSeedDatasets();
    saveDatasetsToStorage(currentDatasets.filter(d => d.id !== id));
  } catch (error) {
    console.warn('API unavailable, deleting from localStorage only:', error);
    // Fallback: delete from localStorage only
    const currentDatasets = getSeedDatasets();
    saveDatasetsToStorage(currentDatasets.filter(d => d.id !== id));
  }
}

export async function resetDatasets(): Promise<ChartDataset[]> {
  try {
    const res = await apiPost<ApiListResponse<ChartDataset>>("/api/datasets/reset", {});
    saveDatasetsToStorage(res.data);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, resetting to seed data:', error);
    // Fallback: reset to seed data
    return resetDatasetsToSeed();
  }
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
  try {
    const params = new URLSearchParams();
    if (filter?.locale)  params.set("locale",  filter.locale);
    if (filter?.status)  params.set("status",  filter.status);
    if (filter?.section) params.set("section", filter.section);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await apiGet<PagesApiResponse>(`/api/pages${qs}`);
    // ALWAYS use API data, save to localStorage as cache
    savePagesToStorage(res.data);
    return res.data;
  } catch (error) {
    console.warn('API unavailable for fetchPages, using cached data:', error);
    // Fallback to localStorage cache ONLY
    const cachedPages = getSeedPages();
    // Apply filters locally if provided
    if (!filter || cachedPages.length === 0) return cachedPages;
    return cachedPages.filter(p => {
      if (filter.locale && p.locale !== filter.locale) return false;
      if (filter.status && p.status !== filter.status) return false;
      if (filter.section && p.section !== filter.section) return false;
      return true;
    });
  }
}

export async function fetchPage(id: number): Promise<Page> {
  try {
    const res = await apiGet<PageApiResponse>(`/api/pages/${id}`);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, fetching from seed:', error);
    const seedPages = getSeedPages();
    const found = seedPages.find(p => p.id === id);
    if (!found) throw new Error(`Page ${id} not found`);
    return found;
  }
}

export async function fetchPageBySlug(slug: string, locale?: string): Promise<Page> {
  try {
    const params = new URLSearchParams();
    params.set("path", slug);
    if (locale) params.set("locale", locale);
    const res = await apiGet<PageApiResponse>(`/api/pages/lookup?${params.toString()}`);
    return res.data;
  } catch (lookupErr) {
    try {
      const q = locale ? `?locale=${encodeURIComponent(locale)}` : "";
      const res = await apiGet<PageApiResponse>(`/api/pages/slug/${encodeURIComponent(slug)}${q}`);
      return res.data;
    } catch {
      console.warn("API unavailable, fetching page from cache/seed:", lookupErr);
      const seedPages = getSeedPages();
      const found = seedPages.find((p) => p.slug === slug && (!locale || p.locale === locale));
      if (!found) throw new Error(`Page ${slug} not found`);
      return found;
    }
  }
}

export async function createPage(data: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<Page> {
  try {
    const res = await apiPost<PageApiResponse>("/api/pages", data);
    // Update localStorage cache with new page
    const currentPages = getSeedPages();
    savePagesToStorage([...currentPages, res.data]);
    return res.data;
  } catch (error) {
    console.warn('API unavailable for createPage, saving to localStorage only:', error);
    // Fallback: save to localStorage only (for offline/demo)
    const newPage: Page = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const currentPages = getSeedPages();
    savePagesToStorage([...currentPages, newPage]);
    return newPage;
  }
}

export async function updatePage(id: number, data: Partial<Omit<Page, "id" | "createdAt" | "updatedAt">>): Promise<Page> {
  try {
    const res = await apiPut<PageApiResponse>(`/api/pages/${id}`, data);
    // Update localStorage cache
    const currentPages = getSeedPages();
    const updatedPages = currentPages.map(p => p.id === id ? { ...p, ...data } : p);
    savePagesToStorage(updatedPages as Page[]);
    return res.data;
  } catch (error) {
    console.warn('API unavailable for updatePage, updating localStorage only:', error);
    // Fallback: update localStorage only
    const currentPages = getSeedPages();
    const index = currentPages.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Page ${id} not found in cache`);
    const updated = { ...currentPages[index], ...data, updatedAt: new Date().toISOString() } as Page;
    currentPages[index] = updated;
    savePagesToStorage(currentPages);
    return updated;
  }
}

export async function deletePageAPI(id: number): Promise<void> {
  try {
    await apiDelete(`/api/pages/${id}`);
    const currentPages = getSeedPages();
    savePagesToStorage(currentPages.filter(p => p.id !== id));
  } catch (error) {
    console.warn('API unavailable, deleting from localStorage only:', error);
    const currentPages = getSeedPages();
    savePagesToStorage(currentPages.filter(p => p.id !== id));
  }
}

export async function resetPages(): Promise<Page[]> {
  try {
    const res = await apiPost<PagesApiResponse>("/api/pages/reset", {});
    savePagesToStorage(res.data);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, resetting to seed data:', error);
    return resetPagesToSeed();
  }
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
  try {
    const params = new URLSearchParams();
    if (filter?.locale)   params.set("locale",   filter.locale);
    if (filter?.status)   params.set("status",   filter.status);
    if (filter?.category) params.set("category",  filter.category);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await apiGet<PostsApiResponse>(`/api/blog${qs}`);
    savePostsToStorage(res.data);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, using seed posts:', error);
    const seedPosts = getSeedPosts();
    if (!filter) return seedPosts;
    return seedPosts.filter(p => {
      if (filter.locale && p.locale !== filter.locale) return false;
      if (filter.status && p.status !== filter.status) return false;
      if (filter.category && p.category !== filter.category) return false;
      return true;
    });
  }
}

export async function fetchPost(id: number): Promise<BlogPost> {
  try {
    const res = await apiGet<PostApiResponse>(`/api/blog/${id}`);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, fetching from seed:', error);
    const seedPosts = getSeedPosts();
    const found = seedPosts.find(p => p.id === id);
    if (!found) throw new Error(`Post ${id} not found`);
    return found;
  }
}

export async function createPost(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
  try {
    const res = await apiPost<PostApiResponse>("/api/blog", data);
    const currentPosts = getSeedPosts();
    savePostsToStorage([...currentPosts, res.data]);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, saving to localStorage only:', error);
    const newPost: BlogPost = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const currentPosts = getSeedPosts();
    savePostsToStorage([...currentPosts, newPost]);
    return newPost;
  }
}

export async function updatePost(id: number, data: Partial<Omit<BlogPost, "id" | "createdAt" | "updatedAt">>): Promise<BlogPost> {
  try {
    const res = await apiPut<PostApiResponse>(`/api/blog/${id}`, data);
    const currentPosts = getSeedPosts();
    const updated = currentPosts.map(p => p.id === id ? { ...p, ...data } : p);
    savePostsToStorage(updated as BlogPost[]);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, updating localStorage only:', error);
    const currentPosts = getSeedPosts();
    const index = currentPosts.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Post ${id} not found`);
    const updated = { ...currentPosts[index], ...data, updatedAt: new Date().toISOString() } as BlogPost;
    currentPosts[index] = updated;
    savePostsToStorage(currentPosts);
    return updated;
  }
}

export async function deletePostAPI(id: number): Promise<void> {
  try {
    await apiDelete(`/api/blog/${id}`);
    const currentPosts = getSeedPosts();
    savePostsToStorage(currentPosts.filter(p => p.id !== id));
  } catch (error) {
    console.warn('API unavailable, deleting from localStorage only:', error);
    const currentPosts = getSeedPosts();
    savePostsToStorage(currentPosts.filter(p => p.id !== id));
  }
}

export async function resetPosts(): Promise<BlogPost[]> {
  try {
    const res = await apiPost<PostsApiResponse>("/api/blog/reset", {});
    savePostsToStorage(res.data);
    return res.data;
  } catch (error) {
    console.warn('API unavailable, resetting to seed data:', error);
    return resetPostsToSeed();
  }
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



export function usePageBySlug(slug: string, locale?: string) {
  return useQuery({
    queryKey: ["page", "slug", slug, locale ?? "all"],
    queryFn:  () => fetchPageBySlug(slug, locale),
    enabled:  Boolean(slug),
    staleTime: 30_000,
  });
}
function invalidatePageSlugQueries(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["page", "slug"] });
}

export function useCreatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.pages });
      invalidatePageSlugQueries(qc);
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
      invalidatePageSlugQueries(qc);
    },
  });
}

export function useDeletePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePageAPI,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.pages });
      invalidatePageSlugQueries(qc);
    },
  });
}

export function useResetPages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: resetPages,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.pages });
      invalidatePageSlugQueries(qc);
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
