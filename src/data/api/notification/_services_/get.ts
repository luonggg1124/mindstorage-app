/* eslint-disable */
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { create } from "zustand";
import { useAuth } from "../../auth";
import { Client } from "@stomp/stompjs";
import { toast } from "@/lib/toast";
import { INotification } from "@/data/models/notification";
import type { IInviteNotificationDataDto, IMyNotificationDto, NotificationTypeDto } from "../_dto_";
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

export function parseNotificationData(raw: string | null | undefined): IInviteNotificationDataDto | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as IInviteNotificationDataDto;
    return null;
  } catch {
    return null;
  }
}

export function isInviteNotificationType(type: NotificationTypeDto | null | undefined) {
  return type === "INVITE_TO_JOIN_SPACE" || type === "INVITE_TO_JOIN_GROUP";
}

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
      if (response.error) {
        throw new Error(response.error?.message || "Lỗi khi lấy thông báo");
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
      if (response.error) {
        throw new Error(response.error?.message || "Lỗi khi lấy số thông báo chưa đọc");
      }
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

export const useNotificationSocket = () => {
    const { accessToken } = useAuth();
    
    const queryClient = useQueryClient();
    const { setUnreadCount, incrementUnread } = useNotificationStore();
    useEffect(() => {
        if (!accessToken) return () => {};
        const client = new Client({
            brokerURL: import.meta.env.VITE_WS_URL,
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                client.subscribe(
                    "/user/queue/notifications",
                    (message) => {
                        const notification = JSON.parse(message.body) as INotification;
                        toast.info(notification.title, {
                            description: notification.content,
                            position: "bottom-right"
                        });
                        queryClient.setQueryData(
                            [notificationKeys.all],
                            (old: any[] = []) => [
                                notification,
                                ...old
                            ]
                        )
                        incrementUnread();
                    }
                );
                client.subscribe(
                    "/user/queue/notifications/count",
                    (message) => {
                        const count = JSON.parse(message.body) as number;
                        setUnreadCount(count);
                    }
                )

            },
            onStompError: (frame) => {
                console.error("Stomp error:", frame);
            }
        });
        client.activate();
        return () => client.deactivate();
    }, [accessToken, queryClient, incrementUnread, setUnreadCount]);
}

export const useNotification = () => {
    const { unreadCount, setUnreadCount, incrementUnread } = useNotificationStore();
    return { unreadCount, setUnreadCount, incrementUnread };
}