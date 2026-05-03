/* eslint-disable */
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { create } from "zustand";
import type { IMyNotificationDto } from "../_dto_";
import { NotificationSDK } from "../_sdk_";

type NotificationStore = {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
}
export const useNotificationStore = create<NotificationStore>((set) => (
  {
    unreadCount: 0,
    setUnreadCount: (count: number) => set({ unreadCount: count }),
    incrementUnread: () => set((state: { unreadCount: number }) => ({ unreadCount: state.unreadCount + 1 })),
  }
));

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
}

export const myNotificationsKeys = {
  all: ["my-notifications"] as const,
  infinite: (request: { q: string; size: number }) => [...myNotificationsKeys.all, "infinite", request] as const,
};

export type UseMyNotificationsInfiniteRequest = {
  query?: {
    q?: string;
    size?: number;
  };
};

/**
 * Backend paging is 1-based by default (page=1).
 */
export const useMyNotificationsInfinite = (
  request: UseMyNotificationsInfiniteRequest = {
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

  const query = useInfiniteQuery({
    queryKey: myNotificationsKeys.infinite(queryKey),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await NotificationSDK.myNotifications({
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
  });

  const allData: IMyNotificationDto[] = query.data?.pages.flatMap((p) => p.data ?? []) ?? [];
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
      queryClient.invalidateQueries({ queryKey: myNotificationsKeys.infinite(queryKey) });
    },
  };
};

export const useUnreadNotificationCount = () => {
  const queryClient = useQueryClient();
  const { setUnreadCount } = useNotificationStore();

  const query = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await NotificationSDK.unreadCount();
      const payload = response.data;
      if (payload == null) {
        throw new Error("Không có dữ liệu");
      }
      return Number(payload);
    },
    staleTime: 15_000,
  });

  useEffect(() => {
    if (typeof query.data === "number" && Number.isFinite(query.data)) {
      setUnreadCount(query.data);
    }
  }, [query.data, setUnreadCount]);

  return {
    loading: query.isLoading,
    data: query.data ?? 0,
    error: query.error,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() }),
  };
};



export const useNotification = () => {
  const { unreadCount, setUnreadCount, incrementUnread } = useNotificationStore();
  return { unreadCount, setUnreadCount, incrementUnread };
}