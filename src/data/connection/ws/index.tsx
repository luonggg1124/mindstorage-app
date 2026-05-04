import { useAuth } from "@/data/api/auth";
import { myNotificationsKeys, notificationKeys, useNotificationStore } from "@/data/api/notification";
import type { IInviteNotificationData, IRoleChangeNotificationData } from "@/data/models/notification";
import { INotification, normalizeNotificationType, NotificationType } from "@/data/models/notification";
import { initAuth } from "@/data/api/auth/_services_/init-auth";
import { userKeys } from "@/data/api/user/_services_/get";
  import { toast } from "@/lib/toast";
import { Client } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

function toastInviteWhere(invite: IInviteNotificationData | null): "không gian" | "nhóm" {
  const t = (invite?.entityType ?? "").toUpperCase();
  if (t.includes("GROUP")) return "nhóm";
  if (t.includes("SPACE")) return "không gian";
  return "không gian";
}

/** Toast WS: layout / màu riêng, không dùng NotificationBody sidebar. */
function WsNotificationToastContent({ notification }: { notification: INotification }) {
  const bar = "mt-0.5 h-10 w-1 shrink-0 rounded-full bg-amber-400/95 shadow-[0_0_12px_rgba(251,191,36,0.35)]";
  const hl = "font-semibold text-amber-200";
  const kind = normalizeNotificationType(notification.type, notification.data);
  
  if (kind === NotificationType.INVITE) {
    const invite = notification.data as IInviteNotificationData | null;
    const where = toastInviteWhere(invite);
    const status = (invite?.invitationStatus ?? "").trim().toUpperCase();
    return (
      <div className="flex gap-3 text-left">
        <div className={bar} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold tracking-tight text-white">
            {status === "ACCEPTED"
              ? "Lời mời đã được chấp nhận"
              : status === "REJECTED"
                ? "Lời mời đã bị từ chối"
                : `Lời mời tham gia ${where}`}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-200/95">
            {invite?.senderName ? <span className={hl}>{invite.senderName}</span> : <span>Một thành viên</span>}
            <span>
              {status === "ACCEPTED"
                ? ` đã chấp nhận lời mời vào ${where} `
                : status === "REJECTED"
                  ? ` đã từ chối lời mời vào ${where} `
                  : " mời bạn vào "}
            </span>
            {invite?.entityName ? (
              <span className={hl}>{invite.entityName}</span>
            ) : invite?.entityId ? (
              <span className={hl}>{invite.entityId}</span>
            ) : (
              <span className="text-slate-400">…</span>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (kind === NotificationType.ROLE_CHANGED) {
    const role = notification.data as IRoleChangeNotificationData | null;
    return (
      <div className="flex gap-3 text-left">
        <div className={bar} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold tracking-tight text-white">Thay đổi vai trò</p>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-200/95">
            {role?.changedByName ? (
              <>
                <span className={hl}>{role.changedByName}</span>
                <span> · </span>
              </>
            ) : null}
            {role?.targetUserName ? (
              <>
                <span className="text-slate-400">Đối tượng: </span>
                <span className={hl}>{role.targetUserName}</span>
              </>
            ) : null}
            {role?.entityName ? (
              <>
                <span className="text-slate-400"> · </span>
                <span className={hl}>{role.entityName}</span>
              </>
            ) : role?.entityId ? (
              <>
                <span className="text-slate-400"> · </span>
                <span className={hl}>{role.entityId}</span>
              </>
            ) : null}
            {role?.oldRole != null && role.oldRole !== "" && role?.newRole != null && role.newRole !== "" ? (
              <>
                <span className="text-slate-400"> — </span>
                <span className={hl}>{role.oldRole}</span>
                <span className="text-slate-500"> → </span>
                <span className={hl}>{role.newRole}</span>
              </>
            ) : role?.newRole ? (
              <>
                <span className="text-slate-400"> → </span>
                <span className={hl}>{role.newRole}</span>
              </>
            ) : !role?.changedByName && !role?.targetUserName ? (
              <span>Vai trò đã được cập nhật.</span>
            ) : null}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 text-left">
      <div className={bar} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-white">Thông báo</p>
        <p className="mt-1 text-[12px] text-slate-300">Bạn có thông báo mới.</p>
      </div>
    </div>
  );
}

export const useWebSocket = () => {
  const { accessToken, refreshToken } = useAuth();

  const queryClient = useQueryClient();
  const { setUnreadCount, incrementUnread } = useNotificationStore();
  const refreshingRef = useRef(false);

  const tryRefreshToken = async (reason?: unknown) => {
    if (refreshingRef.current) return;
    if (!refreshToken) return;

    refreshingRef.current = true;
    try {
      await initAuth();
    } catch (e) {
      console.error("WS refresh token failed:", reason ?? e);
    } finally {
      refreshingRef.current = false;
    }
  };

  const isUnauthorizedLike = (value: unknown): boolean => {
    const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
    return /401|unauthoriz|forbidden|jwt|token/i.test(text);
  };
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
        client.subscribe("/user/queue/notifications", (message) => {
          const notification = JSON.parse(message.body) as INotification;
          toast.info(
            <WsNotificationToastContent notification={notification} />,
            {
              position: "bottom-right",
              duration: 5000,
              className:
                "animate-in slide-in-from-right-4 fade-in-0 rounded-[14px] border border-amber-500/20 bg-slate-950/95 px-4 py-3 text-[14px] leading-snug min-w-[360px] max-w-[460px] shadow-2xl backdrop-blur-sm",
            }
          );
          queryClient.invalidateQueries({ queryKey: myNotificationsKeys.all });
          queryClient.invalidateQueries({ queryKey: notificationKeys.all });
          queryClient.invalidateQueries({ queryKey: userKeys.myProfile() });
          incrementUnread();
        });
        client.subscribe("/user/queue/notifications/count", (message) => {
          const count = JSON.parse(message.body) as number;
          setUnreadCount(count);
         
        });
      },
      onStompError: (frame) => {
        console.error("Stomp error:", frame);
        const msg = frame.headers?.message ?? "";
        const body = frame.body ?? "";
        if (isUnauthorizedLike(msg) || isUnauthorizedLike(body)) {
          void tryRefreshToken({ msg, body });
        }
      },
      onWebSocketClose: (evt) => {
        // Nếu token hết hạn / bị từ chối, backend thường đóng socket.
        if (isUnauthorizedLike(evt?.reason) || evt?.code === 1008) {
          void tryRefreshToken(evt);
        }
      },
      onWebSocketError: (evt) => {
        if (isUnauthorizedLike(evt)) {
          void tryRefreshToken(evt);
        }
      },
    });
    client.activate();
    return () => client.deactivate();
  }, [accessToken, queryClient, incrementUnread, refreshToken, setUnreadCount]);
};
