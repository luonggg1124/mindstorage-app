import type {
  IInviteNotificationData,
  IRoleChangeNotificationData,
  NotificationType,
} from "@/data/models/notification";

type MyNotificationBase = {
  id: string;
  userId: number;
  senderId: number | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
};

/** `type` + `data` khớp cặp (discriminated union). */
export type IMyNotificationDto = MyNotificationBase &
  (
    | { type: NotificationType.INVITE; data: IInviteNotificationData | null }
    | { type: NotificationType.ROLE_CHANGED; data: IRoleChangeNotificationData | null }
  );
