// TanStack Query client configuration
//
// Caching strategy:
// - datasets: staleTime 5min, gcTime 10min — data changes infrequently
// - single dataset: staleTime 2min — might be edited in CMS simultaneously
// - mutations: onSuccess invalidates datasets list to trigger refetch
//
// Retry: 2 attempts with exponential backoff (handles transient network errors)

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      gcTime:    1000 * 60 * 10,   // 10 minutes (formerly cacheTime)
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
      refetchOnWindowFocus: false, // only manually or on mutation invalidation
    },
    mutations: {
      retry: 1,
    },
  },
});
