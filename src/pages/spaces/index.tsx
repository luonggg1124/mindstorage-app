import { FormEvent, useState } from "react";
import { Link } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type WorkspaceSpace, workspaceSpaces } from "@/data/workspace";

const SpacesPage = () => {
  const [spaces, setSpaces] = useState<WorkspaceSpace[]>(workspaceSpaces);
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleCreateSpace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newSpace.name.trim();
    const description = newSpace.description.trim();
    const image = newSpace.image.trim();

    if (!name) {
      return;
    }

    const createdSpace: WorkspaceSpace = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`,
      name,
      description: description || "Space mới vừa được tạo từ trang quản lý workspace.",
      image: image || "/spaces/default-space.svg",
      groups: [],
    };

    setSpaces((currentSpaces) => [createdSpace, ...currentSpaces]);
    setNewSpace({ name: "", description: "", image: "" });
    setIsCreateSpaceOpen(false);
  };

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Workspace</p>
            <h1 className="text-3xl font-bold tracking-tight">Spaces</h1>
            <p className="text-muted-foreground">
              Danh sách các space làm việc. Chọn một space để xem các group bên trong.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateSpaceOpen(true)}
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Thêm space
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {spaces.map((space) => {
            const totalNotes = space.groups.reduce((total, group) => total + group.notes.length, 0);

            return (
              <Link
                key={space.id}
                to={`/spaces/${space.id}`}
                className="overflow-hidden rounded-xl border bg-card shadow-sm transition hover:border-primary hover:shadow-md"
              >
                <img src={space.image} alt={space.name} className="h-40 w-full object-cover" />

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold">{space.name}</h2>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      {space.groups.length} group
                    </span>
                  </div>

                  <p className="mb-3 text-sm text-muted-foreground">{space.description}</p>

                  <div className="mb-3 flex gap-3 text-xs text-muted-foreground">
                    <span>{space.groups.length} nhóm</span>
                    <span>•</span>
                    <span>{totalNotes} note</span>
                  </div>

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {space.groups.length > 0 ? (
                      space.groups.slice(0, 3).map((group) => <li key={group.id}>• {group.name}</li>)
                    ) : (
                      <li>• Chưa có group nào</li>
                    )}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
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

            <div>
              <label className="mb-1 block text-sm font-medium">Image URL</label>
              <input
                value={newSpace.image}
                onChange={(event) => setNewSpace((current) => ({ ...current, image: event.target.value }))}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="/spaces/default-space.svg hoặc URL ảnh"
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
                Tạo space
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpacesPage;
