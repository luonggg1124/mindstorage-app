/* eslint-disable */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/data/types";
import { NotificationSDK } from "../_sdk_";
import { myNotificationsKeys, notificationKeys, useNotificationStore } from "./get";

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();
  const { setUnreadCount } = useNotificationStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await NotificationSDK.readAll();
      return response;
    },
    onSuccess: () => {
      setUnreadCount(0);
      queryClient.invalidateQueries({ queryKey: myNotificationsKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    data: mutation.data?.data,
    error: mutation.error as ApiError | undefined | null,
   
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

export const useReadOneNotification = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { id: string }) => {
      const response = await NotificationSDK.readOne({ params: { id: body.id } });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myNotificationsKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    data: mutation.data?.data,
    error: mutation.error as ApiError | undefined | null,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

