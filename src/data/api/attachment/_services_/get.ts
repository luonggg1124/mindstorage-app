import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/data/api/auth";
import type { IAttachment } from "@/data/models/attachment";
import { AttachmentSDK } from "../_sdk_";

export const attachmentKeys = {
  all: ["attachment"] as const,
  myAttachmentsInfinite: (request: { size: number }) =>
    [...attachmentKeys.all, "my-attachments", "infinite", request] as const,
  totalSize: () => [...attachmentKeys.all, "my-attachments", "total-size"] as const,
};

export type UseMyAttachmentsInfiniteRequest = {
  query?: {
    size?: number;
  };
};

/** Backend `page` mặc định 0 (Spring). */
export const useMyAttachmentsInfinite = (
  request: UseMyAttachmentsInfiniteRequest = {
    query: { size: 12 },
  }
) => {
  const { accessToken, hasHydrated } = useAuth();
  const queryClient = useQueryClient();

  const size = Number(request.query?.size ?? 12);
  const queryKey = {
    size: Number.isFinite(size) && size > 0 ? size : 12,
  };

  const query = useInfiniteQuery({
    queryKey: attachmentKeys.myAttachmentsInfinite(queryKey),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await AttachmentSDK.myAttachments({
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

      const currentPage = Number(lastPage.page ?? 0);
      return currentPage + 1;
    },
    initialPageParam: 0,
    enabled: hasHydrated && !!accessToken,
  });

  const allData: IAttachment[] = query.data?.pages.flatMap((p) => p.data ?? []) ?? [];
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
      queryClient.invalidateQueries({ queryKey: attachmentKeys.myAttachmentsInfinite(queryKey) });
    },
  };
};

export const useMyAttachmentsTotalSize = () => {
  const queryClient = useQueryClient();
  const { accessToken, hasHydrated } = useAuth();

  const query = useQuery({
    queryKey: attachmentKeys.totalSize(),
    queryFn: async () => {
      const response = await AttachmentSDK.myAttachmentsTotalSize();
      const payload = response.data;
      if (payload == null) {
        throw new Error("Không có dữ liệu dung lượng");
      }
      return payload;
    },
    enabled: hasHydrated && !!accessToken,
    staleTime: 30_000,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: attachmentKeys.totalSize() }),
  };
};
