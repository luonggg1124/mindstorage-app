import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import clientPaths from "@/paths/client";
import { useDetailSpace, useSpaceMembersInfinite } from "@/data/api/space";
import { useCreateGroup, useDeleteGroup, useGroupsBySpaceInfinite, useUpdateGroup } from "@/data/api/group";
import { formatRelative } from "@/utils/date";
import LoadingDots from "@/components/animate/loading-dots";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, PencilIcon, Settings2Icon, Share2Icon, Trash2Icon, UsersIcon } from "lucide-react";
import { EditGroupModal } from "./components/edit-group-modal";
import ShareSpaceModal from "./components/share-space-modal";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import { useDebounce } from "@/hooks/use-debounce";
import SpaceMembersSheet from "./components/space-members-sheet";

const SpaceDetailPage = () => {
  const { id } = useParams();
  const spaceDetail = useDetailSpace(id);
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 500);
  const [shareOpen, setShareOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [memberQ, setMemberQ] = useState("");
  const debouncedMemberQ = useDebounce(memberQ, 400);
  const groupsInfinite = useGroupsBySpaceInfinite({ params: { spaceId: id }, query: { q: debouncedQ, page: 1, size: 12 } });
  const membersInfinite = useSpaceMembersInfinite({
    params: { id: String(id ?? "") },
    query: { q: debouncedMemberQ, size: 10 },
  });
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<null | { id: string; name: string; description: string }>(null);
  const [deleteTarget, setDeleteTarget] = useState<null | { id: string; name: string }>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

  if (!id?.trim()) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Thiếu mã không gian</h1>
        <Link
          to={clientPaths.space.list.getPath()}
          className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Quay lại danh sách
        </Link>
      </section>
    );
  }

  if (spaceDetail.loading) {
    return (
      <section className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-7 w-48 animate-pulse rounded-md bg-white/10" />
              <div className="h-4 w-full max-w-lg animate-pulse rounded bg-white/10" />
              <div className="h-4 w-3/4 max-w-md animate-pulse rounded bg-white/10" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
              <div className="h-9 w-36 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (spaceDetail.error || !spaceDetail.data) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Không tìm thấy không gian</h1>
        <p className="text-muted-foreground">
          {(spaceDetail.error as Error)?.message || "Không gian không tồn tại hoặc bạn không có quyền xem."}
        </p>
        <Link
          to={clientPaths.space.list.getPath()}
          className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Quay lại danh sách
        </Link>
      </section>
    );
  }

  const space = spaceDetail.data;
  const groups = groupsInfinite.data ?? [];

  const handleAddGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newGroup.name.trim();
    if (!name) return;
    const spaceId = id;
    
    const res = await createGroup.mutateAsync({
      name,
      description: newGroup.description.trim(),
      spaceId,
    });
    if (res.error) return;
    setNewGroup({ name: "", description: "" });
    setIsAddGroupOpen(false);
  };
  const handleUpdateGroup = async ({ name, description }: { name: string; description: string }) => {
    if (!editGroup) return;
    const spaceId = id;
   
    const res = await updateGroup.mutateAsync({ id: editGroup.id, name, description, spaceId });
    if (res.error) return;
    setEditGroup(null);
    groupsInfinite.invalidate();
  }

  const handleConfirmDeleteGroup = async () => {
    if (!deleteTarget) return;
    const res = await deleteGroup.mutateAsync({ id: deleteTarget.id });
    if (res.error) return;
    setDeleteTarget(null);
    setDeleteConfirmText("");
    groupsInfinite.invalidate();
  };
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">{space.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300/90">
              {space.description?.trim() ? space.description : "Chưa có mô tả."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setIsAddGroupOpen(true)}
              className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Thêm nhóm
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  aria-label="Cài đặt"
                >
                  <Settings2Icon className="size-4" />
                  Cài đặt
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setMembersOpen(true)}>
                  <UsersIcon className="size-4" />
                    <span>Thành viên</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              <Share2Icon className="size-4" />
              Chia sẻ
            </button>
            <Link
              to={clientPaths.space.list.getPath()}
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Quay lại 
            </Link>
          </div>
        </div>

      </div>

      <ShareSpaceModal open={shareOpen} onOpenChange={setShareOpen} entityId={String(id ?? "")} />

      <SpaceMembersSheet
        open={membersOpen}
        onOpenChange={(next) => {
          setMembersOpen(next);
        }}
        q={memberQ}
        onChangeQ={setMemberQ}
        membersInfinite={membersInfinite}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-10 w-full max-w-md rounded-full border bg-background px-4 text-sm outline-none placeholder:text-foreground/60 focus:border-primary"
          placeholder="Tìm nhóm (tên/mô tả)..."
          aria-label="Tìm nhóm"
        />
        <span className="text-sm text-slate-300/80">
          Đang xem <span className="font-medium text-slate-100">{groups.length}</span> /{" "}
          <span className="font-medium text-slate-100">{groupsInfinite.total || groups.length}</span>
        </span>
      </div>

      {groupsInfinite.loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
              <div className="h-5 w-1/2 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : groupsInfinite.error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-200">
          {(groupsInfinite.error as Error)?.message || "Lỗi khi tải danh sách nhóm."}
        </div>
      ) : groups.length > 0 ? (
        <ScrollInfinite
          enabled
          hasNextPage={Boolean(groupsInfinite.hasNextPage)}
          isFetchingNextPage={groupsInfinite.fetchingNextPage}
          onLoadMore={() => groupsInfinite.fetchNextPage()}
          className="mt-2"
          
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => {
              const topicCount = Number.isFinite(group.topicCount) ? group.topicCount : 0;
              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur transition hover:border-indigo-400/40 hover:bg-white/[0.07]"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <Link to={clientPaths.group.detail.getPath(String(group.id))} className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-semibold text-slate-100">{group.name}</h2>
                    </Link>

                    <div className="flex shrink-0 items-start gap-2">
                      <span
                        className="shrink-0 rounded-full h-7 border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-200 tabular-nums"
                        title="Số chủ đề trong nhóm"
                      >
                        {topicCount} chủ đề
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex size-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                            aria-label="Mở menu"
                          >
                            <MoreHorizontalIcon className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onClick={() =>
                              setEditGroup({
                                id: group.id,
                                name: group.name,
                                description: group.description ?? "",
                              })
                            }
                          >
                            <PencilIcon className="size-4" />
                            <span>Sửa</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteTarget({ id: group.id, name: group.name });
                              setDeleteConfirmText("");
                            }}
                            className="text-red-300 focus:text-red-200"
                          >
                            <Trash2Icon className="size-4" />
                            <span>Xóa</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-slate-300/85">{group.description}</p>

                  <p className="text-xs text-slate-400">
                    Cập nhật:{" "}
                    {formatRelative(group.updatedAt, "—")}
                  </p>
                </div>
              );
            })}
          </div>

          {groupsInfinite.fetchingNextPage ? (
            <div className="mt-4 text-center text-sm text-slate-300/80">Đang tải thêm…</div>
          ) : null}
        </ScrollInfinite>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-sm text-slate-300/80 backdrop-blur">
          Không gian này chưa có nhóm nào.
        </div>
      )}

      <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Thêm nhóm</DialogTitle>
            <DialogDescription>
              Tạo nhóm mới trong không gian <span className="font-medium text-foreground">{space.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddGroup} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="add-group-name">
                Tên nhóm
              </label>
              <input
                id="add-group-name"
                value={newGroup.name}
                onChange={(e) => setNewGroup((s) => ({ ...s, name: e.target.value }))}
                disabled={createGroup.isPending}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ví dụ: Backend, Frontend"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="add-group-desc">
                Mô tả
              </label>
              <textarea
                id="add-group-desc"
                value={newGroup.description}
                onChange={(e) => setNewGroup((s) => ({ ...s, description: e.target.value }))}
                disabled={createGroup.isPending}
                className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Mô tả ngắn về nhóm"
              />
            </div>
            {createGroup.error?.message ? (
              <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                {createGroup.error.message}
              </div>
            ) : null}
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsAddGroupOpen(false)}
                disabled={createGroup.isPending}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createGroup.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {createGroup.isPending ? <>Đang tạo <LoadingDots /></> : "Tạo nhóm"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteConfirmText("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa nhóm?</DialogTitle>
            <DialogDescription>
              Nhập <span className="font-semibold text-foreground">delete</span> để xác nhận xóa{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name ?? "—"}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirm-delete-group">
              Xác nhận
            </label>
            <input
              id="confirm-delete-group"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Nhập delete"
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteGroup.isPending}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Hủy
            </button>
            {deleteGroup.error?.message ? (
              <div className="mr-auto rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
                {deleteGroup.error.message}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleConfirmDeleteGroup}
              disabled={deleteGroup.isPending || deleteConfirmText.trim().toLowerCase() !== "delete"}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {deleteGroup.isPending ? <>Đang xóa <LoadingDots /></> : "Xóa"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditGroupModal
        open={Boolean(editGroup)}
        onOpenChange={(open) => {
          if (!open) setEditGroup(null);
        }}
        initialValue={{ name: editGroup?.name ?? "", description: editGroup?.description ?? "" }}
        isPending={updateGroup.isPending}
        errorMessage={updateGroup.error?.message || undefined}
        onSubmit={handleUpdateGroup}
      />
    </section>
  );
};

export default SpaceDetailPage;
