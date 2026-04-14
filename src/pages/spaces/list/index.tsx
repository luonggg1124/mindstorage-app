import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateSpace, useDeleteSpace, useMySpacesInfinite } from "@/data/api/space";
import clientPaths from "@/paths/client";
import LoadingDots from "@/components/animate/loading-dots";
import { formatRelative } from "@/utils/date";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditSpaceModal } from "./components/edit-space-modal";
import { useUpdateSpace } from "@/data/api/space";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import { useDebounce } from "@/hooks/use-debounce";

const SpacesPage = () => {
  const createSpace = useCreateSpace();
  const updateSpace = useUpdateSpace();
  const deleteSpace = useDeleteSpace();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 500);
  const spacesInfinite = useMySpacesInfinite({ query: { q: debouncedQ, page: 1, size: 12 } });
  const spaces = useMemo(() => spacesInfinite.data ?? [], [spacesInfinite.data]);
  const totalGroups = useMemo(
    () => spaces.reduce((sum, s) => sum + (Number.isFinite(s.groupCount) ? s.groupCount : 0), 0),
    [spaces],
  );
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<null | { id: number; name: string; description: string }>(null);
  const [deleteTarget, setDeleteTarget] = useState<null | { id: number; name: string }>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
  });

  const handleCreateSpace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newSpace.name.trim();
    const description = newSpace.description.trim();

    if (!name) {
      return;
    }

    const res = await createSpace.mutateAsync({ name, description });
    if (res.error) return;
    setNewSpace({ name: "", description: "" });
    setIsCreateSpaceOpen(false);
  };

  const handleConfirmDeleteSpace = async () => {
    if (!deleteTarget) return;
    const res = await deleteSpace.mutateAsync({ id: deleteTarget.id });
    if (res.error) return;
    setDeleteTarget(null);
    setDeleteConfirmText("");
    spacesInfinite.invalidate();
  };

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div>

            <h1 className="text-3xl font-bold tracking-tight">Không gian</h1>
            <p className="text-slate-300/80">Danh sách không gian làm việc của bạn.</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300/80">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Không gian: <span className="font-medium text-slate-100">{spaces.length}</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Nhóm: <span className="font-medium text-slate-100">{totalGroups}</span>
              </span>
              {spacesInfinite.fetching ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Đang đồng bộ…</span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateSpaceOpen(true)}
            className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Thêm
          </button>
        </div>

        {spacesInfinite.loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur"
              >
                <div className="h-5 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-white/10" />
                <div className="mt-4 flex gap-2">
                  <div className="h-6 w-24 animate-pulse rounded-full bg-white/10" />
                  <div className="h-6 w-28 animate-pulse rounded-full bg-white/10" />
                  <div className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : spacesInfinite.error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-200">
            {(spacesInfinite.error as Error).message || "Lỗi khi tải danh sách không gian."}
          </div>
        ) : spaces.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="h-10 w-full max-w-md rounded-full border bg-background px-4 text-sm outline-none placeholder:text-foreground/60 focus:border-primary"
                placeholder="Tìm không gian (tên/mô tả)..."
                aria-label="Tìm không gian"
              />
              <span className="text-sm text-slate-300/80">
                Đang xem <span className="font-medium text-slate-100">{spaces.length}</span> /{" "}
                <span className="font-medium text-slate-100">{spacesInfinite.total || spaces.length}</span>
              </span>
            </div>

            <ScrollInfinite
              enabled
              hasNextPage={Boolean(spacesInfinite.hasNextPage)}
              isFetchingNextPage={spacesInfinite.fetchingNextPage}
              onLoadMore={() => spacesInfinite.fetchNextPage()}
              className="mt-4"
             
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {spaces.map((space) => {
                  const count = Number.isFinite(space.groupCount) ? space.groupCount : 0;
                  return (
                    <div
                      key={space.id}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur transition hover:border-indigo-400/50 hover:bg-white/7"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link to={clientPaths.space.detail.getPath(space.id.toString())} className="min-w-0 flex-1">
                          <h2 className="truncate text-lg font-semibold text-slate-100 group-hover:text-white">
                            {space.name}
                          </h2>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-300/80">{space.description || ""}</p>
                        </Link>

                        <div className="flex shrink-0 items-start gap-2">
                          <span
                            className="shrink-0 rounded-full border h-7 border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-200 tabular-nums"
                            title="Số nhóm trong không gian"
                          >
                            {count} nhóm
                          </span>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex size-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                                aria-label="Mở menu"
                              >
                                <MoreHorizontalIcon className="size-3" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem
                                onClick={() =>
                                  setEditTarget({
                                    id: space.id,
                                    name: space.name,
                                    description: space.description ?? "",
                                  })
                                }
                              >
                                <PencilIcon className="size-4" />
                                <span>Sửa</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeleteTarget({ id: space.id, name: space.name });
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

                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300/80">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          Tạo: <span className="text-slate-100">{formatRelative(space.createdAt, "—")}</span>
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          Cập nhật: <span className="text-slate-100">{formatRelative(space.updatedAt, "—")}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {spacesInfinite.fetchingNextPage ? (
                <div className="mt-4 text-center text-sm text-slate-300/80">Đang tải thêm…</div>
              ) : null}
            </ScrollInfinite>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-sm text-slate-300/80 backdrop-blur">
            Chưa có không gian nào.
          </div>
        )}
      </section>

      <Dialog open={isCreateSpaceOpen} onOpenChange={setIsCreateSpaceOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Thêm space mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin cơ bản để tạo một space mới trong workspace.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSpace} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Tên space</label>
              <input
                value={newSpace.name}
                onChange={(event) => setNewSpace((current) => ({ ...current, name: event.target.value }))}
                disabled={createSpace.isPending}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ví dụ: Mobile App Team"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Mô tả</label>
              <textarea
                value={newSpace.description}
                onChange={(event) =>
                  setNewSpace((current) => ({ ...current, description: event.target.value }))
                }
                disabled={createSpace.isPending}
                className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Mô tả ngắn về mục đích của space"
              />
            </div>

            {createSpace.error?.message ? (
              <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                {createSpace.error.message}
              </div>
            ) : null}

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsCreateSpaceOpen(false)}
                disabled={createSpace.isPending}
                className="rounded-lg  border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createSpace.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {createSpace.isPending ? <>Đang tạo <LoadingDots /></> : "Thêm"}
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
            <DialogTitle>Xóa không gian?</DialogTitle>
            <DialogDescription>
              Nhập <span className="font-semibold text-foreground">delete</span> để xác nhận xóa{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name ?? "—"}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirm-delete-space">
              Xác nhận
            </label>
            <input
              id="confirm-delete-space"
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
              disabled={deleteSpace.isPending}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Hủy
            </button>
            {deleteSpace.error?.message ? (
              <div className="mr-auto rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
                {deleteSpace.error.message}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleConfirmDeleteSpace}
              disabled={deleteSpace.isPending || deleteConfirmText.trim().toLowerCase() !== "delete"}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {deleteSpace.isPending ? <>Đang xóa <LoadingDots /></> : "Xóa"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditSpaceModal
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        initialValue={{ name: editTarget?.name ?? "", description: editTarget?.description ?? "" }}
        isPending={updateSpace.isPending}
        errorMessage={updateSpace.error?.message || undefined}
        onSubmit={async ({ name, description }) => {
          if (!editTarget) return;
          const res = await updateSpace.mutateAsync({ id: editTarget.id, name, description });
          if (res.error) return;
          setEditTarget(null);
        }}
      />
    </>
  );
};

export default SpacesPage;
