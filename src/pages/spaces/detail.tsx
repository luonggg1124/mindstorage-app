import { Link, useParams } from "react-router";

import { findSpaceById } from "@/data/workspace";
import clientPaths from "@/paths/client";

const SpaceDetailPage = () => {
  const { id } = useParams();
  const space = findSpaceById(id);

  if (!space) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Không tìm thấy space</h1>
        <p className="text-muted-foreground">Space bạn chọn không tồn tại hoặc chưa có dữ liệu.</p>
        <Link
          to={clientPaths.space.list.getPath()}
          className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Quay lại danh sách spaces
        </Link>
      </section>
    );
  }

  const totalNotes = space.groups.reduce((total, group) => total + group.notes.length, 0);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <img src={space.image} alt={space.name} className="h-56 w-full object-cover" />

        <div className="p-6">
          <p className="text-sm text-muted-foreground">Space detail</p>

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{space.name}</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">{space.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-muted px-4 py-3">
                <p className="text-xs text-muted-foreground">Tổng group</p>
                <p className="text-2xl font-semibold">{space.groups.length}</p>
              </div>
              <div className="rounded-xl bg-muted px-4 py-3">
                <p className="text-xs text-muted-foreground">Tổng note</p>
                <p className="text-2xl font-semibold">{totalNotes}</p>
              </div>
              <Link
                to={clientPaths.space.list.getPath()}
                className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Quay lại spaces
              </Link>
            </div>
          </div>
        </div>
      </div>

      {space.groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {space.groups.map((group) => (
            <Link
              key={group.id}
              to={
                group.notes[0]
                  ? clientPaths.group.detail.getPath(group.id, { note: group.notes[0].id })
                  : clientPaths.group.detail.getPath(group.id)
              }
              className="rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{group.name}</h2>
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {group.notes.length} note
                </span>
              </div>

              <p className="mb-3 text-sm text-muted-foreground">{group.description}</p>

              <ul className="space-y-2 text-sm text-muted-foreground">
                {group.notes.slice(0, 3).map((note) => (
                  <li key={note.id}>• {note.title}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-card p-8 text-sm text-muted-foreground">
          Space này hiện chưa có group nào.
        </div>
      )}
    </section>
  );
};

export default SpaceDetailPage;
