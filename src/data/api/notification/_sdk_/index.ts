import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { MyNotificationsRequest, MyNotificationsResponse } from "./my-notifications.type";

export class NotificationSDK {
  static async myNotifications(request: MyNotificationsRequest) {
    const response = await safeRequest(() =>
      client.get<MyNotificationsResponse, ApiError, true>({
        url: apiPaths.notification.myNotifications.getPath(request.query),
        throwOnError: true,
      })
    );
    return response;
  }

  static async unreadCount() {
    const response = await safeRequest(() =>
      client.get<
        { 200: number },
        ApiError,
        true
      >({
        url: apiPaths.notification.unreadCount.path,
        throwOnError: true,
      })
    );
    return response;
  }

  static async readAll() {
    const response = await safeRequest(() =>
      client.patch<
        { 201: { success: boolean } },
        ApiError,
        true
      >({
        url: apiPaths.notification.readAll.path,
        throwOnError: true,
      })
    );
    return response;
  }

  static async readOne(request: { params: { id: string } }) {
    const response = await safeRequest(() =>
      client.patch<
        { 201: { success: boolean } },
        ApiError,
        true
      >({
        url: apiPaths.notification.readOne.getPath(request.params.id),
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./my-notifications.type";

