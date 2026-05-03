import * as React from "react";

import { useAuth } from "@/data/api/auth";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ISpaceMemberUserDto } from "@/data/api/space";
import { useSpaceMembersInfinite, useUpdateSpaceMemberRole } from "@/data/api/space";
import { RoleAction } from "@/data/types/role-action";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "@/lib/toast";
import { formatRelative } from "@/utils/date";

const ROLE_LABEL: Record<RoleAction, string> = {
  [RoleAction.OWNER]: "Chủ sở hữu",
  [RoleAction.EDITOR]: "Biên tập",
  [RoleAction.VIEWER]: "Chỉ xem",
};

const ROLE_OPTIONS: RoleAction[] = [RoleAction.OWNER, RoleAction.EDITOR, RoleAction.VIEWER];

const SpaceMembersSheet = ({
  open,
  onOpenChange,
  spaceId,
  /** Chỉ OWNER (theo `GET /space/{id}/my-role`) được đổi vai trò thành viên khác */
  canManageMemberRoles,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  canManageMemberRoles: boolean;
}) => {
  const { user } = useAuth();
  const [memberQ, setMemberQ] = React.useState("");
  const debouncedMemberQ = useDebounce(memberQ, 400);

  const membersInfinite = useSpaceMembersInfinite({
    params: { id: spaceId },
    query: { q: debouncedMemberQ, size: 10 },
    enabled: open,
  });

  const updateRole = useUpdateSpaceMemberRole();
  const [updatingUserId, setUpdatingUserId] = React.useState<number | null>(null);

  const currentUserId = user?.id;

  React.useEffect(() => {
    if (!open) setMemberQ("");
  }, [open]);

  const handleRoleChange = async (member: ISpaceMemberUserDto, next: RoleAction) => {
    if (next === member.role) return;
    setUpdatingUserId(member.id);
    try {
      await updateRole.mutateAsync({ spaceId, userId: member.id, role: next });
      toast.success("Đã cập nhật vai trò");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể đổi vai trò");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] border-white/10 bg-slate-950/80 px-4 py-4 text-slate-100 backdrop-blur sm:w-[520px]"
      >
        <SheetHeader className="p-0">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0">
              <SheetTitle className="text-slate-100">Thành viên</SheetTitle>
              <p className="mt-1 text-xs text-slate-300/70">
                Tổng:{" "}
                <span className="font-medium text-slate-100">
                  {membersInfinite.total || membersInfinite.data.length}
                </span>
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <input
              value={memberQ}
              onChange={(e) => setMemberQ(e.target.value)}
              placeholder="Tìm theo tên / username..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 outline-none"
              autoFocus
            />
          </div>

          <ScrollInfinite
            enabled={membersInfinite.enabled}
            hasNextPage={Boolean(membersInfinite.hasNextPage)}
            isFetchingNextPage={membersInfinite.fetchingNextPage}
            onLoadMore={() => membersInfinite.fetchNextPage()}
            className="h-[calc(100vh-12.5rem)] space-y-2 overflow-y-auto pr-1"
            endMessage={
              membersInfinite.data.length > 0 ? (
                <div className="py-2 text-center text-xs text-slate-300/60">Đã tải hết.</div>
              ) : null
            }
          >
            {membersInfinite.loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[72px] w-full animate-pulse rounded-xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : null}

            {membersInfinite.data.map((m) => {
              const canEditThis =
                canManageMemberRoles && currentUserId != null && m.id !== currentUserId;
              const busyThis = updatingUserId === m.id;

              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-100">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.fullName} className="size-full object-cover" />
                      ) : (
                        (m.fullName.trim()[0] ?? "U").toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-100">{m.fullName}</p>
                      <p className="truncate text-xs text-slate-300/70">@{m.username}</p>
                      <p className="mt-0.5 text-[11px] text-slate-300/60">Tham gia {formatRelative(m.joinedAt)}</p>
                    </div>
                  </div>

                  {canEditThis ? (
                    <Select
                      value={m.role}
                      onValueChange={(v) => handleRoleChange(m, v as RoleAction)}
                      disabled={busyThis}
                    >
                      <SelectTrigger
                        size="sm"
                        className="h-8 w-[148px] shrink-0 border-white/15 bg-white/5 text-xs font-semibold text-slate-200"
                        aria-label="Đổi vai trò"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-slate-950 text-slate-100">
                        {ROLE_OPTIONS.map((r) => (
                          <SelectItem key={r} value={r} className="text-xs">
                            {ROLE_LABEL[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200"
                      title="Vai trò"
                    >
                      {ROLE_LABEL[m.role] ?? m.role}
                    </span>
                  )}
                </div>
              );
            })}

            {!membersInfinite.loading && membersInfinite.data.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300/70">
                Chưa có thành viên nào.
              </div>
            ) : null}

            {membersInfinite.error ? (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                {(membersInfinite.error as Error)?.message || "Lỗi khi tải danh sách thành viên."}
              </div>
            ) : null}
          </ScrollInfinite>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SpaceMembersSheet;
