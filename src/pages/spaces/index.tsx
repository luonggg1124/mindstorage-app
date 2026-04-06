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
import { useMySpaces } from "@/data/api/space";
import clientPaths from "@/paths/client";

function formatDateTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

const SpacesPage = () => {
  const mySpaces = useMySpaces();
  const spaces = useMemo(() => mySpaces.data ?? [], [mySpaces.data]);
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
  });

  const handleCreateSpace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newSpace.name.trim();
    void newSpace.description.trim();

    if (!name) {
      return;
    }

    // Trang này chỉ hiển thị dữ liệu từ API (useMySpaces).
    // Tạo space cần endpoint riêng; hiện tại chỉ đóng modal.
    setNewSpace({ name: "", description: "" });
    setIsCreateSpaceOpen(false);
  };

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-slate-300/80">Workspace</p>
            <h1 className="text-3xl font-bold tracking-tight">Không gian</h1>
            <p className="text-slate-300/80">Danh sách không gian làm việc của bạn.</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300/80">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Tổng: <span className="font-medium text-slate-100">{spaces.length}</span>
              </span>
              {mySpaces.fetching ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Đang đồng bộ…</span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateSpaceOpen(true)}
            className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Thêm space
          </button>
        </div>

        {mySpaces.loading ? (
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
                  <div className="h-6 w-28 animate-pulse rounded-full bg-white/10" />
                  <div className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : mySpaces.error ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-6 text-sm text-amber-200">
            {(mySpaces.error as Error).message || "Lỗi khi tải danh sách không gian."}
          </div>
        ) : spaces.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {spaces.map((space) => (
              <Link
                key={space.id}
                to={clientPaths.space.detail.getPath(space.id.toString())}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur transition hover:border-indigo-400/50 hover:bg-white/7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-slate-100 group-hover:text-white">
                      {space.name}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-300/80">
                      {space.description || "—"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300/80">
                    #{space.id}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300/80">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    Tạo: <span className="text-slate-100">{formatDateTime(space.createdAt)}</span>
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    Cập nhật: <span className="text-slate-100">{formatDateTime(space.updatedAt)}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
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
                className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Mô tả ngắn về mục đích của space"
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsCreateSpaceOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Đóng
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpacesPage;
