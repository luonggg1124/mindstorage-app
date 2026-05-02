import * as React from "react";
import { useNavigate } from "react-router";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import clientPaths from "@/paths/client";
import { useDebounce } from "@/hooks/use-debounce";
import { useUserSearchInfinite } from "@/data/api/user";

type SidebarFriendsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SidebarFriends({ open, onOpenChange }: SidebarFriendsProps) {
  const navigate = useNavigate();
  const [q, setQ] = React.useState("");
  const debouncedQ = useDebounce(q, 400);

  const usersInfinite = useUserSearchInfinite({
    query: { q: debouncedQ, size: 10 },
  });

  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[360px] border-white/10 bg-slate-950/80 px-4 py-4 text-slate-100 backdrop-blur"
      >
        <SheetHeader>
          <SheetTitle className="text-slate-100">Bạn bè</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên / username..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 outline-none"
              autoFocus
            />
          </div>

          <ScrollInfinite
            enabled={usersInfinite.enabled}
            hasNextPage={Boolean(usersInfinite.hasNextPage)}
            isFetchingNextPage={usersInfinite.fetchingNextPage}
            onLoadMore={() => usersInfinite.fetchNextPage()}
            className="h-[calc(100vh-10.5rem)] space-y-2 overflow-y-auto pr-1"
            endMessage={
              usersInfinite.data.length > 0 ? (
                <div className="py-2 text-center text-xs text-slate-300/60">Đã tải hết.</div>
              ) : null
            }
          >
            {usersInfinite.loading ? (
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[56px] w-full animate-pulse rounded-xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : null}

            {usersInfinite.data.map((u) => (
              <button
                key={String(u.id)}
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  navigate(clientPaths.profile.detail.getPath(String(u.id)));
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-100">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.fullName} className="size-full object-cover" />
                    ) : (
                      (u.fullName?.trim()?.[0] ?? "U").toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-100">{u.fullName}</p>
                    <p className="truncate text-xs text-slate-300/70">@{u.username}</p>
                  </div>
                </div>

                <span className="shrink-0 text-xs text-slate-300/70">Xem</span>
              </button>
            ))}

            {!usersInfinite.loading && usersInfinite.enabled && usersInfinite.data.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-3 text-sm text-slate-300/70">
                Không tìm thấy người phù hợp.
              </div>
            ) : null}

            {usersInfinite.error ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
                {(usersInfinite.error as Error)?.message || "Lỗi khi tìm kiếm"}
              </div>
            ) : null}
          </ScrollInfinite>
        </div>
      </SheetContent>
    </Sheet>
  );
}

