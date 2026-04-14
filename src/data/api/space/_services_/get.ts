import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/data/api/auth";
import { SpaceSDK } from "../_sdk_";

export const spaceKeys = {
  all: ["space"] as const,
  mySpaces: () => [...spaceKeys.all, "my-spaces"] as const,
  detail: (id: string) => [...spaceKeys.all, "detail", id] as const,
  mySpacesInfinite: (request: { q: string; size: number }) => [...spaceKeys.all, "my-spaces", "infinite", request] as const,
};

export const useMySpaces = () => {
  const queryClient = useQueryClient();
  const { accessToken, hasHydrated } = useAuth();

  const query = useQuery({
    queryKey: spaceKeys.mySpaces(),
    queryFn: async () => {
      const { data, error } = await SpaceSDK.mySpaces({ query: { q: "", page: 1, size: 1000 } });
      if (error) {
        throw new Error(error?.message || "Lỗi khi lấy danh sách không gian.");
      }
      return data?.data ?? [];
    },
    enabled: hasHydrated && !!accessToken,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    mutate: () => query.refetch(),
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.mySpaces() });
    },
  };
};

export const useDetailSpace = (spaceId?: string) => {
  const queryClient = useQueryClient();
  const { accessToken, hasHydrated } = useAuth();
  const rawId = (spaceId ?? "").trim();

  const query = useQuery({
    queryKey: spaceKeys.detail(rawId),
    queryFn: async () => {
      const { data, error } = await SpaceSDK.detail({ id: rawId });
      if (error) {
        
        throw new Error(error?.message || "Lỗi khi tải chi tiết không gian");
      }
      if (data == null) {
        throw new Error("Không tìm thấy không gian");
      }
      return data;
    },
    enabled: hasHydrated && !!accessToken && rawId.length > 0,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.detail(rawId) });
    },
  };
};

export type UseSpacesInfiniteRequest = {
  query: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export const useMySpacesInfinite = (
  request: UseSpacesInfiniteRequest = {
    query: {
      q: "",
      page: 1,
      size: 12,
    },
  }
) => {
  const { accessToken, hasHydrated } = useAuth();
  const queryClient = useQueryClient();

  // Exclude page from queryKey since infinite query manages pages internally
  const { page, ...queryWithoutPage } = request.query;
  const normalizedQ = (queryWithoutPage.q ?? "").trim();
  const size = Number(queryWithoutPage.size ?? 12);
  const queryKey = { q: normalizedQ, size: Number.isFinite(size) && size > 0 ? size : 12 };

  const query = useInfiniteQuery({
    queryKey: spaceKeys.mySpacesInfinite(queryKey),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await SpaceSDK.mySpaces({
        query: {
          q: normalizedQ,
          page: pageParam as number,
          size: queryKey.size,
        },
      });
      if (response.error) {
        throw new Error(response.error?.message || "Lỗi khi lấy danh sách không gian.");
      }

      const payload = response.data;
      if (!payload) {
        throw new Error("Không có dữ liệu");
      }

      // payload: { page, size, total, data }
      return payload;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage.data)) {
        return undefined;
      }

      const pageSize = Number(lastPage.size ?? queryKey.size ?? lastPage.data.length ?? 0);
      const total = Number(lastPage.total ?? 0);
      const currentLength = lastPage.data.length;

      if (!Number.isFinite(pageSize) || pageSize <= 0) {
        return undefined;
      }

      const loadedCount = allPages.reduce(
        (sum, p) => sum + (Array.isArray(p?.data) ? p.data.length : 0),
        0
      );

      if (total > 0 && loadedCount >= total) {
        return undefined;
      }

      if (currentLength < pageSize) {
        return undefined;
      }

      const currentPage = Number(lastPage.page ?? 1);
      return currentPage + 1;
    },
    initialPageParam: 1,
    enabled: hasHydrated && !!accessToken,
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
      queryClient.invalidateQueries({ queryKey: spaceKeys.mySpacesInfinite(queryKey) });
    },
  };
};
