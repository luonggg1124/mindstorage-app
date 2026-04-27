export type NotificationTypeDto = "INVITE_TO_JOIN_SPACE" | "INVITE_TO_JOIN_GROUP" | (string & {});

export interface IMyNotificationDto {
  id: string; // UUID
  userId: number;
  senderId: number | null;
  title: string;
  content: string;
  type: NotificationTypeDto;
  data: string | null; // JSON string
  isRead: boolean;
  readAt: string | null;
  createdAt: string; // ISO string
}

export type IInviteNotificationDataDto = {
  invitationId?: string;
  entityId?: string;
  entityName?: string;
  entityType?: string;
  senderId?: number;
  senderName?: string;
};

