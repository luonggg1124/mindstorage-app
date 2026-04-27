import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import { useInvite } from "@/data/api/invitation";
import { useUserSearchInviteInfinite } from "@/data/api/user";
import { toast } from "@/lib/toast";

const ShareSpaceModal = ({
  open,
  onOpenChange,
  entityId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityId: string;
}) => {
  const [memberQ, setMemberQ] = useState("");
  const [invitedIds, setInvitedIds] = useState<Set<number>>(() => new Set());

  const invite = useInvite();

  const userSearch = useUserSearchInviteInfinite({
    query: { q: memberQ.trim(), size: 10, type: "SPACE", entityId },
  });

  const searchResults = userSearch.data;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setMemberQ("");
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chia sẻ không gian</DialogTitle>
          <DialogDescription>
            <span className="text-slate-300/80">Tìm người để mời vào không gian.</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <input
              value={memberQ}
              onChange={(e) => setMemberQ(e.target.value)}
              placeholder="Tìm theo tên / username..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 outline-none"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-200">Kết quả tìm kiếm</p>
              <p className="text-xs text-slate-300/70">{userSearch.total || searchResults.length} kết quả</p>
            </div>

            <ScrollInfinite
              className="h-[220px] space-y-2 overflow-y-auto pr-1"
              enabled={userSearch.enabled}
              hasNextPage={Boolean(userSearch.hasNextPage)}
              isFetchingNextPage={userSearch.fetchingNextPage}
              onLoadMore={() => userSearch.fetchNextPage()}
              endMessage={
                searchResults.length > 0 ? (
                  <div className="py-2 text-center text-xs text-slate-300/60">Đã tải hết.</div>
                ) : null
              }
            >
              {userSearch.loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[52px] w-full animate-pulse rounded-xl border border-white/10 bg-white/5"
                    />
                  ))}
                </div>
              ) : null}

              {searchResults.map((m) => {
                const isMember = Boolean(m.isMember);
                const alreadyInvited = invitedIds.has(m.id);
                const canInvite = !isMember && !alreadyInvited;
                
                
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-100">
                        {(m.fullName.trim()[0] ?? "U").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100">{m.fullName}</p>
                        <p className="truncate text-xs text-slate-300/70">@{m.username}</p>
                      </div>
                    </div>

                    {isMember ? (
                      <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
                        Đã tham gia
                      </span>
                    ) : alreadyInvited ? (
                      <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
                        Đã mời
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!canInvite) return;
                          const res = await invite.mutateAsync({
                            inviteeId: m.id,
                            entityId,
                            entityType: "SPACE",
                          });
                          if (res.error) {
                            toast.error(res.error?.message || "Mời thất bại");
                            return;
                          }
                          setInvitedIds((prev) => new Set(prev).add(m.id));
                          toast.success("Đã gửi lời mời.");
                        }}
                        disabled={!canInvite || invite.isPending}
                        className="shrink-0 rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
                      >
                        Mời
                      </button>
                    )}
                  </div>
                );
              })}

              {!userSearch.loading && searchResults.length === 0 ? (
                <div className="rounded-xl text-center border border-dashed border-white/15 bg-white/5 p-3 text-sm text-slate-300/70">
                  Không tìm thấy.
                </div>
              ) : null}

              {userSearch.error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
                  {(userSearch.error as Error)?.message || "Lỗi khi tìm kiếm"}
                </div>
              ) : null}
            </ScrollInfinite>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSpaceModal;

