// API client — thin fetch wrapper around the AndaraLab REST API.
// Base URL is set via the api-client-react lib on app init.

import { setBaseUrl } from "@workspace/api-client-react";
import { API_BASE_URL } from "./config";

// Initialize base URL once at module load
setBaseUrl(API_BASE_URL);

function url(path: string): string {
  // Handle relative URLs (e.g. "/api") by prepending window.location.origin
  if (API_BASE_URL.startsWith("/")) {
    return `${window.location.origin}${API_BASE_URL}${path}`;
  }
  return new URL(path, API_BASE_URL).toString();
}

async function rf<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => null);
    throw new Error(`HTTP ${res.status} ${res.statusText}${body ? `: ${body}` : ""}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Typed API helpers ────────────────────────────────────────────────────────

export async function apiGet<T>(path: string): Promise<T> {
  return rf<T>(path);
}

export async function apiPost<T, B = unknown>(path: string, body: B): Promise<T> {
  return rf<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPut<T, B = unknown>(path: string, body: B): Promise<T> {
  return rf<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiDelete(path: string): Promise<void> {
  return rf<void>(path, { method: "DELETE" });
}

// ─── API Response shapes ───────────────────────────────────────────────────────

export interface ApiListResponse<T> {
  data: T[];
  meta: { total: number; category?: string; reset?: boolean };
}

export interface ApiSingleResponse<T> {
  data: T;
  meta?: { created?: boolean; updated?: boolean };
}
