import { Link, useParams } from "react-router";

import { findSpaceById } from "@/data/workspace";
import clientPaths from "@/paths/client";
import { useGroupBySpace } from "@/data/api/group";

const SpaceDetailPage = () => {
  const { id } = useParams();
  const space = findSpaceById(id);
  const groupsQuery = useGroupBySpace(id);

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

  const groups = groupsQuery.data ?? [];

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
                <p className="text-2xl font-semibold">{groups.length}</p>
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

      {groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={clientPaths.group.detail.getPath(String(group.id))}
              className="rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{group.name}</h2>
              </div>

              <p className="mb-3 text-sm text-muted-foreground">{group.description}</p>

              <p className="text-xs text-muted-foreground">
                Cập nhật:{" "}
                {group.updatedAt ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(group.updatedAt)) : "—"}
              </p>
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
