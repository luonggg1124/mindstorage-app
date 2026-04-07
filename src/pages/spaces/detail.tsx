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
import { useDetailSpace } from "@/data/api/space";
import { useCreateGroup, useGroupBySpace } from "@/data/api/group";
import { formatRelative } from "@/utils/date";
import LoadingDots from "@/components/animate/loading-dots";

const SpaceDetailPage = () => {
  const { id } = useParams();
  const spaceDetail = useDetailSpace(id);
  const groupsQuery = useGroupBySpace(id);
  const createGroup = useCreateGroup();
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
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
  const groups = groupsQuery.data ?? [];

  const handleAddGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newGroup.name.trim();
    if (!name) return;
    const spaceId = Number(id);
    if (!Number.isFinite(spaceId)) return;
    const res = await createGroup.mutateAsync({
      name,
      description: newGroup.description.trim(),
      spaceId,
    });
    if (res.error) return;
    setNewGroup({ name: "", description: "" });
    setIsAddGroupOpen(false);
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
            <Link
              to={clientPaths.space.list.getPath()}
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Quay lại spaces
            </Link>
          </div>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={clientPaths.group.detail.getPath(String(group.id))}
              className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur transition hover:border-indigo-400/40 hover:bg-white/[0.07]"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-100">{group.name}</h2>
              </div>

              <p className="mb-3 text-sm text-slate-300/85">{group.description}</p>

              <p className="text-xs text-slate-400">
                Cập nhật:{" "}
                {formatRelative(group.updatedAt, "—")}
              </p>
            </Link>
          ))}
        </div>
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
                {createGroup.isPending ? <>Đang tạo <LoadingDots/></> : "Tạo nhóm"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SpaceDetailPage;
