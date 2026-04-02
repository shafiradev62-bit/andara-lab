// In-memory data store
//
// Architecture note:
// - In production: replace with Drizzle ORM + PostgreSQL
//   (swap the Map operations below for db.select/insert/update/delete calls)
// - The interface is intentionally thin so the swap is a one-file change.

import {
  SEED_DATASETS,
  SEED_PAGES,
  SEED_BLOG_POSTS,
  type SeedDataset,
  type SeedPage,
  type SeedBlogPost,
} from "./seed-data.js";

export type { SeedDataset as Dataset };

// ─── Record Types (what the store actually holds) ─────────────────────────────

export interface PageRecord extends SeedPage {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostRecord extends SeedBlogPost {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Clone utility ────────────────────────────────────────────────────────────

function cloneDeep<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function now() {
  return new Date().toISOString();
}

function nextId(map: Map<number, unknown>): number {
  return map.size === 0 ? 1 : Math.max(...[...map.keys()]) + 1;
}

// ─── Dataset Store ─────────────────────────────────────────────────────────────

export interface DatasetStore {
  list(filter?: { category?: string }): SeedDataset[];
  get(id: string): SeedDataset | undefined;
  create(data: Omit<SeedDataset, "id" | "createdAt" | "updatedAt">): SeedDataset;
  update(id: string, data: Partial<Omit<SeedDataset, "id" | "createdAt" | "updatedAt">>): SeedDataset | null;
  delete(id: string): boolean;
  reset(): void;
  categories(): string[];
}

class InMemoryDatasetStore implements DatasetStore {
  private datasets: Map<string, SeedDataset>;

  constructor() {
    this.datasets = new Map();
    this.seed();
  }

  private seed() {
    this.datasets.clear();
    for (const ds of SEED_DATASETS) {
      this.datasets.set(ds.id, cloneDeep(ds));
    }
  }

  list(filter?: { category?: string }): SeedDataset[] {
    const all = [...this.datasets.values()];
    if (filter?.category) return all.filter((d) => d.category === filter.category);
    return all;
  }

  get(id: string): SeedDataset | undefined { return this.datasets.get(id); }

  create(data: Omit<SeedDataset, "id" | "createdAt" | "updatedAt">): SeedDataset {
    const id = `ds-${now()}-${Math.random().toString(36).slice(2, 6)}`;
    const record: SeedDataset = { ...cloneDeep(data), id, createdAt: now(), updatedAt: now() };
    this.datasets.set(id, record);
    return record;
  }

  update(id: string, data: Partial<Omit<SeedDataset, "id" | "createdAt" | "updatedAt">>): SeedDataset | null {
    const existing = this.datasets.get(id);
    if (!existing) return null;
    const updated: SeedDataset = { ...existing, ...cloneDeep(data), updatedAt: now() };
    this.datasets.set(id, updated);
    return updated;
  }

  delete(id: string): boolean { return this.datasets.delete(id); }
  reset() { this.seed(); }
  categories(): string[] {
    return [...new Set([...this.datasets.values()].map((d) => d.category))].sort();
  }
}

// ─── Page Store ────────────────────────────────────────────────────────────────

export interface PageStore {
  list(filter?: { locale?: string; status?: string; section?: string }): PageRecord[];
  get(id: number): PageRecord | undefined;
  getBySlug(slug: string, locale?: string): PageRecord | undefined;
  getLinked(id: number): PageRecord | undefined;
  create(data: SeedPage): PageRecord;
  update(id: number, data: Partial<SeedPage>): PageRecord | null;
  delete(id: number): boolean;
  reset(): void;
  linkPages(idA: number, idB: number): void;
}

class InMemoryPageStore implements PageStore {
  private pages: Map<number, PageRecord>;

  constructor() {
    this.pages = new Map();
    this.seed();
  }

  private seed() {
    this.pages.clear();
    for (const p of SEED_PAGES) {
      const id = nextId(this.pages);
      this.pages.set(id, { ...cloneDeep(p), id, createdAt: now(), updatedAt: now() });
    }
  }

  list(filter?: { locale?: string; status?: string; section?: string }): PageRecord[] {
    let all = [...this.pages.values()];
    if (filter?.locale)   all = all.filter((p) => p.locale === filter.locale);
    if (filter?.status)  all = all.filter((p) => p.status === filter.status);
    if (filter?.section) all = all.filter((p) => p.section === filter.section);
    return all;
  }

  get(id: number): PageRecord | undefined { return this.pages.get(id); }

  getBySlug(slug: string, locale?: string): PageRecord | undefined {
    const norm = slug.replace(new RegExp("^/"), ""); const matches = [...this.pages.values()].filter((p) => p.slug === norm || p.slug === "/" + norm);
    if (!matches.length) return undefined;
    if (locale) {
      const localized = matches.find((p) => p.locale === locale);
      if (localized) return localized;
    }
    return matches[0];
  }

  getLinked(id: number): PageRecord | undefined {
    const page = this.pages.get(id);
    if (!page?.linkedId) return undefined;
    return this.pages.get(parseInt(page.linkedId, 10));
  }

  create(data: SeedPage): PageRecord {
    const id = nextId(this.pages);
    const record: PageRecord = { ...cloneDeep(data), id, createdAt: now(), updatedAt: now() };
    this.pages.set(id, record);
    return record;
  }

  update(id: number, data: Partial<SeedPage>): PageRecord | null {
    const existing = this.pages.get(id);
    if (!existing) return null;
    const updated: PageRecord = { ...existing, ...cloneDeep(data), updatedAt: now() };
    this.pages.set(id, updated);
    return updated;
  }

  delete(id: number): boolean { return this.pages.delete(id); }
  reset() { this.seed(); }

  linkPages(idA: number, idB: number): void {
    const a = this.pages.get(idA);
    const b = this.pages.get(idB);
    if (a && b) {
      this.pages.set(idA, { ...a, linkedId: String(idB), updatedAt: now() });
      this.pages.set(idB, { ...b, linkedId: String(idA), updatedAt: now() });
    }
  }
}

// ─── Blog Post Store ──────────────────────────────────────────────────────────

export interface BlogPostStore {
  list(filter?: { locale?: string; status?: string; category?: string }): BlogPostRecord[];
  get(id: number): BlogPostRecord | undefined;
  getBySlug(slug: string, locale?: string): BlogPostRecord | undefined;
  getLinked(id: number): BlogPostRecord | undefined;
  create(data: SeedBlogPost): BlogPostRecord;
  update(id: number, data: Partial<SeedBlogPost>): BlogPostRecord | null;
  delete(id: number): boolean;
  reset(): void;
  linkPosts(idA: number, idB: number): void;
}

class InMemoryBlogPostStore implements BlogPostStore {
  private posts: Map<number, BlogPostRecord>;

  constructor() {
    this.posts = new Map();
    this.seed();
  }

  private seed() {
    this.posts.clear();
    for (const p of SEED_BLOG_POSTS) {
      const id = nextId(this.posts);
      this.posts.set(id, { ...cloneDeep(p), id, createdAt: now(), updatedAt: now() });
    }
  }

  list(filter?: { locale?: string; status?: string; category?: string }): BlogPostRecord[] {
    let all = [...this.posts.values()];
    if (filter?.locale)   all = all.filter((p) => p.locale === filter.locale);
    if (filter?.status)  all = all.filter((p) => p.status === filter.status);
    if (filter?.category) all = all.filter((p) => p.category === filter.category);
    return all;
  }

  get(id: number): BlogPostRecord | undefined { return this.posts.get(id); }

  getBySlug(slug: string, locale?: string): BlogPostRecord | undefined {
    const norm = slug.replace(new RegExp("^/"), ""); const matches = [...this.posts.values()].filter((p) => p.slug === norm || p.slug === "/" + norm);
    if (!matches.length) return undefined;
    if (locale) {
      const localized = matches.find((p) => p.locale === locale);
      if (localized) return localized;
    }
    return matches[0];
  }

  getLinked(id: number): BlogPostRecord | undefined {
    const post = this.posts.get(id);
    if (!post?.linkedId) return undefined;
    return this.posts.get(parseInt(post.linkedId, 10));
  }

  create(data: SeedBlogPost): BlogPostRecord {
    const id = nextId(this.posts);
    const record: BlogPostRecord = { ...cloneDeep(data), id, createdAt: now(), updatedAt: now() };
    this.posts.set(id, record);
    return record;
  }

  update(id: number, data: Partial<SeedBlogPost>): BlogPostRecord | null {
    const existing = this.posts.get(id);
    if (!existing) return null;
    const updated: BlogPostRecord = { ...existing, ...cloneDeep(data), updatedAt: now() };
    this.posts.set(id, updated);
    return updated;
  }

  delete(id: number): boolean { return this.posts.delete(id); }
  reset() { this.seed(); }

  linkPosts(idA: number, idB: number): void {
    const a = this.posts.get(idA);
    const b = this.posts.get(idB);
    if (a && b) {
      this.posts.set(idA, { ...a, linkedId: String(idB), updatedAt: now() });
      this.posts.set(idB, { ...b, linkedId: String(idA), updatedAt: now() });
    }
  }
}

// ─── Singleton exports ─────────────────────────────────────────────────────────

export const datasetStore: DatasetStore  = new InMemoryDatasetStore();
export const pageStore: PageStore          = new InMemoryPageStore();
export const blogPostStore: BlogPostStore  = new InMemoryBlogPostStore();
