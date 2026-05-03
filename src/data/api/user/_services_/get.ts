import { QueryClient, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSDK } from "../_sdk_";
import type { IInviteUserDto, InvitationTypeDto, ISimpleUserDto } from "../_dto_";

export const userKeys = {
  all: ["users"] as const,
  myProfile: () => [...userKeys.all, "my-profile"] as const,
  searchInfinite: (request: { q: string; size: number }) => [...userKeys.all, "search", "infinite", request] as const,
  searchInviteInfinite: (request: { q: string; size: number; type: InvitationTypeDto; entityId: string }) =>
    [...userKeys.all, "search-invite", "infinite", request] as const,
};

const fetchMyProfile = async () => {
  const { data } = await UserSDK.myProfile();
  
  if (!data) {
    throw new Error("Không có dữ liệu hồ sơ");
  }
  return data;
};

export const useMyProfile = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: userKeys.myProfile(),
    queryFn: fetchMyProfile,
    retry: false,
    
    refetchOnWindowFocus: false,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.myProfile() });
    },
  };
};

export const prefetchMyProfile = (queryClient: QueryClient) => {
  return queryClient.prefetchQuery({
    queryKey: userKeys.myProfile(),
    queryFn: fetchMyProfile,
  });
}

export type UseUserSearchInfiniteRequest = {
  query?: {
    q?: string;
    size?: number;
  };
};

/**
 * Backend paging is 1-based by default (page=1).
 */
export const useUserSearchInfinite = (
  request: UseUserSearchInfiniteRequest = {
    query: { q: "", size: 10 },
  }
) => {
  const queryClient = useQueryClient();

  const normalizedQ = (request.query?.q ?? "").trim();
  const size = Number(request.query?.size ?? 10);

  const queryKey = {
    q: normalizedQ,
    size: Number.isFinite(size) && size > 0 ? size : 10,
  };

  const enabled = normalizedQ.length > 0;

  const query = useInfiniteQuery({
    queryKey: userKeys.searchInfinite(queryKey),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await UserSDK.search({
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

  const allData: ISimpleUserDto[] = query.data?.pages.flatMap((p) => p.data ?? []) ?? [];
  const total = Number(query.data?.pages?.[0]?.total ?? 0);

  return {
    enabled,
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
      queryClient.invalidateQueries({ queryKey: userKeys.searchInfinite(queryKey) });
    },
  };
};

export type UseUserSearchInviteInfiniteRequest = {
  query: {
    q?: string;
    size?: number;
    type: InvitationTypeDto;
    entityId?: string | null;
  };
};

/**
 * Backend paging is 1-based by default (page=1).
 */
export const useUserSearchInviteInfinite = (
  request: UseUserSearchInviteInfiniteRequest = {
    query: { q: "", size: 10, type: "SPACE", entityId: null },
  }
) => {
  const queryClient = useQueryClient();

  const normalizedQ = (request.query.q ?? "").trim();
  const size = Number(request.query.size ?? 10);
  const type = request.query.type;
  const entityId = (request.query.entityId ?? "").trim();

  const queryKey = {
    q: normalizedQ,
    size: Number.isFinite(size) && size > 0 ? size : 10,
    type,
    entityId,
  };

  const enabled = normalizedQ.length > 0 && entityId.length > 0;

  const query = useInfiniteQuery({
    queryKey: userKeys.searchInviteInfinite(queryKey),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await UserSDK.searchInvite({
        query: {
          q: normalizedQ || undefined,
          page: pageParam as number,
          size: queryKey.size,
          type,
          entityId,
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

  const allData: IInviteUserDto[] = query.data?.pages.flatMap((p) => p.data ?? []) ?? [];
  const total = Number(query.data?.pages?.[0]?.total ?? 0);

  return {
    enabled,
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
      queryClient.invalidateQueries({ queryKey: userKeys.searchInviteInfinite(queryKey) });
    },
  };
};