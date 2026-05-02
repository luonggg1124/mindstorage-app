import { useAuth } from "@/data/api/auth";
import { myNotificationsKeys, notificationKeys, useNotificationStore } from "@/data/api/notification";
import { INotification } from "@/data/models/notification";
import { toast } from "@/lib/toast";
import { Client } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useWebSocket = () => {
    const { accessToken } = useAuth();
  
    const queryClient = useQueryClient();
    const { setUnreadCount, incrementUnread } = useNotificationStore();
    useEffect(() => {
      if (!accessToken) return () => { };
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
                position: "bottom-right",
                duration: 5000,
                className:
                  "animate-in slide-in-from-right-4 fade-in-0 rounded-[14px] px-4 py-3 text-[14px] leading-snug min-w-[360px] max-w-[460px] shadow-2xl",
              });
              queryClient.invalidateQueries({ queryKey: myNotificationsKeys.all });
              queryClient.invalidateQueries({ queryKey: notificationKeys.all });
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