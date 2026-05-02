import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { NoteSDK } from "../_sdk_";

export const noteKeys = {
  all: ["note"] as const,
  byTopicInfinite: (request: { topicId: string; q: string; size: number }) =>
    [...noteKeys.all, "by-topic", "infinite", request] as const,
  byParentInfinite: (request: { parentId: string; size: number }) =>
    [...noteKeys.all, "by-parent", "infinite", request] as const,
};

export type UseNotesByTopicInfiniteRequest = {
  params: { topicId?: string | number | null };
  query: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export const useNotesByTopicInfinite = (
  request: UseNotesByTopicInfiniteRequest = {
    params: { topicId: null },
    query: { q: "", page: 1, size: 10 },
  }
) => {
  const queryClient = useQueryClient();

  const rawTopicId = request.params.topicId;
  const topicId = rawTopicId == null ? "" : String(rawTopicId).trim();
  const enabled = topicId.length > 0;

  // Exclude page from queryKey since infinite query manages pages internally
  const { page, ...queryWithoutPage } = request.query;
  const normalizedQ = (queryWithoutPage.q ?? "").trim();
  const size = Number(queryWithoutPage.size ?? 10);

  const queryKey = {
    topicId,
    q: normalizedQ,
    size: Number.isFinite(size) && size > 0 ? size : 10,
  };

  const query = useInfiniteQuery({
    queryKey: noteKeys.byTopicInfinite(queryKey),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await NoteSDK.byTopic({
        params: { topicId },
        query: {
          q: normalizedQ || undefined,
          page: pageParam as number,
          size: queryKey.size,
        },
      });
     
      const payload = response.data;
      if (!payload) {
        throw new Error("Không có dữ liệu");
      }
      return payload;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage.data)) return undefined;

      const pageSize = Number(lastPage.size ?? queryKey.size ?? lastPage.data.length ?? 0);
      const total = Number(lastPage.total ?? 0);
      const currentLength = lastPage.data.length;

      if (!Number.isFinite(pageSize) || pageSize <= 0) return undefined;

      const loadedCount = allPages.reduce((sum, p) => sum + (Array.isArray(p?.data) ? p.data.length : 0), 0);
      if (total > 0 && loadedCount >= total) return undefined;
      if (currentLength < pageSize) return undefined;

      const currentPage = Number(lastPage.page ?? 1);
      return currentPage + 1;
    },
    initialPageParam: 1,
    enabled,
  });

  const allData = query.data?.pages.flatMap((p) => p.data ?? []) ?? [];
  const total = Number(query.data?.pages?.[0]?.total ?? 0);

  return {
    loading: query.isLoading,
    fetching: query.isFetching,
    fetchingNextPage: query.isFetchingNextPage,
    data: allData,
    pages: query.data?.pages ?? [],
    total,
    error: query.error,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.byTopicInfinite(queryKey) });
    },
  };
};

export type UseNotesByParentInfiniteRequest = {
  params: { parentId?: string | number | null };
  query: {
    page?: number;
    size?: number;
  };
};

/**
 * This hook uses 1-based paging by default (page starts at 1).
 */
export const useNotesByParentInfinite = (
  request: UseNotesByParentInfiniteRequest = {
    params: { parentId: null },
    query: { page: 1, size: 12 },
  }
) => {
  const queryClient = useQueryClient();

  const rawParentId = request.params.parentId;
  const parentId = rawParentId == null ? "" : String(rawParentId).trim();
  const enabled = parentId.length > 0;

  // Exclude page from queryKey since infinite query manages pages internally
  const { page: _page, ...queryWithoutPage } = request.query;
  const size = Number(queryWithoutPage.size ?? 12);

  const queryKey = {
    parentId,
    size: Number.isFinite(size) && size > 0 ? size : 12,
  };

  const query = useInfiniteQuery({
    queryKey: noteKeys.byParentInfinite(queryKey),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await NoteSDK.byParent({
        params: { parentId },
        query: {
          page: pageParam as number,
          size: queryKey.size,
        },
      });
      
      const payload = response.data;
      if (!payload) {
        throw new Error("Không có dữ liệu");
      }
      return payload;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage.data)) return undefined;

      const pageSize = Number(lastPage.size ?? queryKey.size ?? lastPage.data.length ?? 0);
      const total = Number(lastPage.total ?? 0);
      const currentLength = lastPage.data.length;

      if (!Number.isFinite(pageSize) || pageSize <= 0) return undefined;

      const loadedCount = allPages.reduce((sum, p) => sum + (Array.isArray(p?.data) ? p.data.length : 0), 0);
      if (total > 0 && loadedCount >= total) return undefined;
      if (currentLength < pageSize) return undefined;

      const currentPage = Number(lastPage.page ?? 1);
      return currentPage + 1;
    },
    initialPageParam: 1,
    enabled,
  });

  const allData = query.data?.pages.flatMap((p) => p.data ?? []) ?? [];
  const total = Number(query.data?.pages?.[0]?.total ?? 0);

  return {
    loading: query.isLoading,
    fetching: query.isFetching,
    fetchingNextPage: query.isFetchingNextPage,
    data: allData,
    pages: query.data?.pages ?? [],
    total,
    error: query.error,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.byParentInfinite(queryKey) });
    },
  };
};

