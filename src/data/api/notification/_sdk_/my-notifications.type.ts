import type { IMyNotificationDto } from "../_dto_";
import type { IPageResponse } from "@/data/types";

export type MyNotificationsRequest = {
  query?: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export type MyNotificationsResponse = {
  200: IPageResponse<IMyNotificationDto>;
};

export type MyNotificationsError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

