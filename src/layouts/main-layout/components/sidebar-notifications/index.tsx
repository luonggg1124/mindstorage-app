import * as React from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import { useAcceptInvitation, useRejectInvitation } from "@/data/api/invitation";
import { spaceKeys } from "@/data/api/space";
import {
  useReadAllNotifications,
  useReadOneNotification,
  useMyNotificationsInfinite,
  useNotification,
  useUnreadNotificationCount,
} from "@/data/api/notification";
import type { IInviteNotificationData } from "@/data/models/notification";
import { normalizeNotificationType, NotificationType } from "@/data/models/notification";
import NotificationBody from "./notification-body";
import { getRelativeTime } from "@/utils/date";
import { InvitationStatus } from "@/data/models/invitation";
import { useQueryClient } from "@tanstack/react-query";

type SidebarNotificationsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadCountChange?: (count: number) => void;
};

export function SidebarNotifications({ open, onOpenChange, onUnreadCountChange }: SidebarNotificationsProps) {
  const queryClient = useQueryClient();
  const { unreadCount } = useNotification();
  const acceptInvitation = useAcceptInvitation();
  const rejectInvitation = useRejectInvitation();
  const readAll = useReadAllNotifications();
  const readOne = useReadOneNotification();
  const [readingId, setReadingId] = React.useState<string | null>(null);

  const notificationsInfinite = useMyNotificationsInfinite({
    query: { q: "", size: 10 },
  });

  useUnreadNotificationCount();

  React.useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[360px] border-white/10 bg-slate-950/80 px-4 py-4 text-slate-100 backdrop-blur"
      >
        <SheetHeader>
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="text-slate-100">Thông báo</SheetTitle>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => notificationsInfinite.refetch()}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
                disabled={notificationsInfinite.fetching}
                title="Tải lại thông báo"
              >
                Làm mới
              </button>
              <button
                type="button"
                onClick={() => readAll.mutate()}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
                disabled={unreadCount === 0 || readAll.isPending}
                title="Đánh dấu tất cả là đã đọc"
              >
                Đã đọc tất cả
              </button>
            </div>
          </div>
        </SheetHeader>

        <ScrollInfinite
          className="mt-4 space-y-2 overflow-y-auto pb-2"
          hasNextPage={Boolean(notificationsInfinite.hasNextPage)}
          isFetchingNextPage={notificationsInfinite.fetchingNextPage}
          onLoadMore={() => notificationsInfinite.fetchNextPage()}
          endMessage={
            notificationsInfinite.data.length > 0 ? (
              <div className="py-3 text-center text-xs text-slate-300/60">Đã tải hết.</div>
            ) : null
          }
        >
          {notificationsInfinite.loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[84px] w-full animate-pulse rounded-xl border border-white/10 bg-white/5" />
              ))}
            </div>
          ) : null}

          {!notificationsInfinite.loading && notificationsInfinite.data.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300/70">
              Chưa có thông báo.
            </div>
          ) : null}

          {notificationsInfinite.data.map((n) => {
            const createdText = getRelativeTime(n.createdAt);
            const kind = normalizeNotificationType(n.type, n.data);
            const isInvite = kind === NotificationType.INVITE;
            const inviteMeta = isInvite ? (n.data as IInviteNotificationData | null) : null;
            const invitationId = inviteMeta?.invitationId?.trim();
            const invitationStatus = (inviteMeta?.invitationStatus ?? "").toUpperCase();
            const canShowInviteActions =
              invitationStatus.length > 0 && invitationStatus === InvitationStatus.PENDING;

            const canAct = isInvite && canShowInviteActions && Boolean(invitationId);

            const busy = acceptInvitation.isPending || rejectInvitation.isPending;
            const readingThis = readingId === n.id;

            return (
              <div
                key={n.id}
                className={[
                  "w-full rounded-xl border p-3 text-left transition",
                  n.read
                    ? "border-white/10 bg-white/3 opacity-70"
                    : "border-indigo-400/25 bg-indigo-500/10",
                  readingThis ? "pointer-events-none opacity-60" : null,
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={async () => {
                    if (!n.read) {
                      setReadingId(n.id);
                      try {
                        await readOne.mutateAsync({ id: n.id });
                      } finally {
                        setReadingId((prev) => (prev === n.id ? null : prev));
                      }
                    }
                    if (!isInvite) onOpenChange(false);
                  }}
                  className="block w-full text-left transition hover:opacity-95"
                  disabled={readingThis}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-start gap-2">
                        {!n.read ? <span className="mt-1.5 size-2 shrink-0 rounded-full bg-indigo-400" /> : null}
                        <div className="min-w-0 flex-1">
                          <NotificationBody row={{ type: n.type, data: n.data }} dimmed={n.read} />
                        </div>
                      </div>
                    </div>
                    <span className={["shrink-0 text-[11px]", n.read ? "text-slate-300/50" : "text-slate-300/70"].join(" ")}>
                      {createdText}
                    </span>
                  </div>
                </button>

                {isInvite && canShowInviteActions ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!invitationId) return;
                        await acceptInvitation.mutateAsync({ id: invitationId });
                        notificationsInfinite.invalidate();
                        queryClient.invalidateQueries({ queryKey: spaceKeys.all });
                      }}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                      disabled={!canAct || busy || readingThis}
                      title={!invitationId ? "Thiếu invitationId trong data" : "Chấp nhận"}
                    >
                      Chấp nhận
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!invitationId) return;
                        await rejectInvitation.mutateAsync({ id: invitationId });
                        notificationsInfinite.invalidate();
                        queryClient.invalidateQueries({ queryKey: spaceKeys.all });
                      }}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
                      disabled={!canAct || busy || readingThis}
                      title={!invitationId ? "Thiếu invitationId trong data" : "Từ chối"}
                    >
                      Từ chối
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}

          {notificationsInfinite.error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
              {(notificationsInfinite.error as Error)?.message || "Lỗi khi tải thông báo"}
            </div>
          ) : null}
        </ScrollInfinite>
      </SheetContent>
    </Sheet>
  );
}

