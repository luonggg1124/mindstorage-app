import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { GroupSDK } from "../_sdk_";

export const groupKeys = {
  all: ["group"] as const,
  bySpace: (request: { spaceId: string | number }) => [...groupKeys.all, "by-space", request] as const,
  bySpaceInfinite: (request: { spaceId: string; q: string; size: number }) =>
    [...groupKeys.all, "by-space", "infinite", request] as const,
  detail: (request: { id: string | number }) => [...groupKeys.all, "detail", request] as const,
};



export const useGroupBySpace = (spaceId?: string) => {
  const queryClient = useQueryClient();
  const normalizedId = (spaceId ?? "").trim();
  const enabled = normalizedId.length > 0;

  const queryKey = { spaceId: normalizedId };

  const query = useQuery({
    queryKey: groupKeys.bySpace(queryKey),
    queryFn: async () => {
      const { data, error } = await GroupSDK.bySpace({
        params: { spaceId: normalizedId },
        query: { q: "", page: 1, size: 1000 },
      });
      if (error) {
        throw new Error(error?.message || "Lỗi khi lấy danh sách group");
      }
      return Array.isArray(data?.data) ? data.data : [];
    },
    enabled,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    mutate: () => query.refetch(),
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.bySpace(queryKey) });
    },
  };
};

export type UseGroupsBySpaceInfiniteRequest = {
  params: { spaceId?: string };
  query: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export const useGroupsBySpaceInfinite = (
  request: UseGroupsBySpaceInfiniteRequest = {
    params: { spaceId: "" },
    query: { q: "", page: 1, size: 12 },
  }
) => {
  const queryClient = useQueryClient();
  const normalizedId = (request.params.spaceId ?? "").trim();
  const enabled = normalizedId.length > 0;

  // Exclude page from queryKey since infinite query manages pages internally
  const { page, ...queryWithoutPage } = request.query;
  const normalizedQ = (queryWithoutPage.q ?? "").trim();
  const size = Number(queryWithoutPage.size ?? 12);

  const queryKey = {
    spaceId: normalizedId,
    q: normalizedQ,
    size: Number.isFinite(size) && size > 0 ? size : 12,
  };

  const query = useInfiniteQuery({
    queryKey: groupKeys.bySpaceInfinite(queryKey),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await GroupSDK.bySpace({
        params: { spaceId: normalizedId },
        query: {
          q: normalizedQ,
          page: pageParam as number,
          size: queryKey.size,
        },
      });
      if (response.error) {
        throw new Error(response.error?.message || "Lỗi khi lấy danh sách group");
      }
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
      queryClient.invalidateQueries({ queryKey: groupKeys.bySpaceInfinite(queryKey) });
    },
  };
};

export const useDetailGroup = (id?: string) => {
  const queryClient = useQueryClient();
  const normalizedId = (id ?? "").trim();
  const enabled = normalizedId.length > 0;

  const queryKey = { id: normalizedId };

  const query = useQuery({
    queryKey: groupKeys.detail(queryKey),
    queryFn: async () => {
      const { data, error } = await GroupSDK.detail({ params: { id: Number(normalizedId) } });
      if (error) {
        throw new Error(error?.message || "Lỗi khi lấy chi tiết group");
      }
      if (!data) {
        throw new Error("Không tìm thấy group");
      }
      return data;
    },
    enabled,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(queryKey) });
    },
  };
};


