import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { MyNotificationsError, MyNotificationsRequest, MyNotificationsResponse } from "./my-notifications.type";

export class NotificationSDK {
  static async myNotifications<ThrowOnError extends boolean = false>(request: MyNotificationsRequest) {
    const response = await client.get<MyNotificationsResponse, MyNotificationsError, ThrowOnError>({
      url: apiPaths.notification.myNotifications.getPath(request.query),
    });
    return response;
  }

  static async unreadCount<ThrowOnError extends boolean = false>() {
    const response = await client.get<
      { 200: number },
      { [key: number]: { message: string; status: number } },
      ThrowOnError
    >({
      url: apiPaths.notification.unreadCount.path,
    });
    return response;
  }

  static async readAll<ThrowOnError extends boolean = false>() {
    const response = await client.patch<
      { 201 : { success: boolean } },
      { [key: number]: { message: string; status: number } },
      ThrowOnError
    >({
      url: apiPaths.notification.readAll.path,
    });
    return response;
  }

  static async readOne<ThrowOnError extends boolean = false>(request: { params: { id: string } }) {
    const response = await client.patch<
      { 201: { success: boolean } },
      { [key: number]: { message: string; status: number } },
      ThrowOnError
    >({
      url: apiPaths.notification.readOne.getPath(request.params.id),
    });
    return response;
  }
}

export type * from "./my-notifications.type";

