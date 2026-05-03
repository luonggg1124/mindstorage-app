/** Phải khớp chuỗi JSON từ API/WS (không dùng numeric enum — JSON.parse trả về string). */
export enum NotificationType {
  INVITE = "INVITE",
  ROLE_CHANGED = "ROLE_CHANGED",
}

/**
 * Chuẩn hoá `type` từ backend (string khác nhau, hoặc số 0/1 cũ) + suy luận từ `data` khi cần.
 */
export function normalizeNotificationType(raw: unknown, data: unknown): NotificationType | null {
  const inferFromData = (): NotificationType | null => {
    if (!data || typeof data !== "object") return null;
    const d = data as Record<string, unknown>;
    const invitationId = typeof d.invitationId === "string" ? d.invitationId.trim() : "";
    if (invitationId !== "" || typeof d.invitationStatus === "string") return NotificationType.INVITE;
    if (
      "changedByName" in d ||
      "changedByUserId" in d ||
      "oldRole" in d ||
      "newRole" in d ||
      "targetUserName" in d
    ) {
      return NotificationType.ROLE_CHANGED;
    }
    return null;
  };

  if (typeof raw === "number" && Number.isFinite(raw)) {
    if (raw === 0) return NotificationType.INVITE;
    if (raw === 1) return NotificationType.ROLE_CHANGED;
  }

  const s = String(raw ?? "").trim().toUpperCase();
  if (s) {
    if (
      s === "INVITE" ||
      s.endsWith("_INVITE") ||
      s.includes("GROUP_INVITE") ||
      s.includes("SPACE_INVITE") ||
      s.includes("INVITE")
    ) {
      return NotificationType.INVITE;
    }
    if (
      s === "ROLE_CHANGED" ||
      s === "ROLE_CHANGE" ||
      s === "CHANGE_ROLE" ||
      s.includes("ROLE_CHANGED") ||
      s.includes("ROLE_CHANGE") ||
      s.includes("CHANGE_ROLE") ||
      (s.includes("ROLE") && s.includes("CHANGE"))
    ) {
      return NotificationType.ROLE_CHANGED;
    }
  }

  return inferFromData();
}

export type IInviteNotificationData = {
  invitationId?: string;
  invitationStatus?: string;
  entityId?: string;
  entityName?: string;
  entityType?: string;
  senderId?: number;
  senderName?: string;
};

export interface IRoleChangeNotificationData {
  entityType?: string;
  entityId?: string;
  entityName?: string;
  targetUserId?: number;
  targetUserName?: string;
  oldRole?: string;
  newRole?: string;
  changedByUserId?: number;
  changedByName?: string;
}

type NotificationBase = {
  id: string;
  userId?: number;
  senderId?: number | null;
  read: boolean;
  readAt?: string | null;
  createdAt?: string;
};

/** WS: `type` quyết định hình dạng `data`. */
export type INotification = NotificationBase &
  (
    | { type: NotificationType.INVITE; data: IInviteNotificationData | null }
    | { type: NotificationType.ROLE_CHANGED; data: IRoleChangeNotificationData | null }
  );
