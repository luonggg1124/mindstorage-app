import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

import clientPaths from "@/paths/client";
import { useDetailGroup } from "@/data/api/group";
import { formatRelative } from "@/utils/date";
import { useCreateTag, useTagsByGroup } from "@/data/api/tag";
import { CreateTagModal } from "./components/create-tag-modal";
import { TagTabs } from "./components/tag-tabs";
import { TagNotes } from "./components/tag-notes";

const GroupPage = () => {
  const { id } = useParams();
  const groupDetail = useDetailGroup(id);
  const tagsQuery = useTagsByGroup(id);
  const createTag = useCreateTag();
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [activeTagId, setActiveTagId] = useState<number | null>(null);
  const tags = useMemo(() => tagsQuery.data ?? [], [tagsQuery.data]);

  // keep activeTagId stable with current tag list
  useEffect(() => {
    if (tags.length === 0) {
      if (activeTagId !== null) setActiveTagId(null);
      return;
    }
    if (activeTagId != null && tags.some((t) => t.id === activeTagId)) return;
    setActiveTagId(tags[0]?.id ?? null);
  }, [tags, activeTagId]);

  if (!id?.trim()) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Thiếu mã group</h1>
        <Link
          to={clientPaths.space.list.getPath()}
          className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          Quay lại spaces
        </Link>
      </section>
    );
  }

  if (groupDetail.loading) {
    return (
      <section className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
          <div className="space-y-2">
            <div className="h-7 w-56 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full max-w-lg animate-pulse rounded bg-white/10" />
            <div className="h-4 w-3/4 max-w-md animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (groupDetail.error || !groupDetail.data) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Không tìm thấy group</h1>
        <p className="text-slate-300/80">
          {(groupDetail.error as Error)?.message || "Group không tồn tại hoặc bạn không có quyền xem."}
        </p>
        <Link
          to={clientPaths.space.list.getPath()}
          className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          Quay lại spaces
        </Link>
      </section>
    );
  }

  const group = groupDetail.data;

  const handleCreateTag = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newTagName.trim();
    if (!name) return;
    const groupId = Number(id);
    if (!Number.isFinite(groupId)) return;
    const res = await createTag.mutateAsync({ name, groupId });
    if (res.error) return;
    setNewTagName("");
    setIsCreateTagOpen(false);
  };

  return (
    <section >
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-300/70">Group</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">{group.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300/90">
              {group.description?.trim() ? group.description : "Chưa có mô tả."}
            </p>
            <p className="mt-3 text-xs text-slate-300/70">
              Tạo: {formatRelative(group.createdAt, "—")} · Cập nhật: {formatRelative(group.updatedAt, "—")}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setIsCreateTagOpen(true)}
              className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Tạo thẻ
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

      <TagTabs
        loading={tagsQuery.loading}
        errorMessage={(tagsQuery.error as Error | undefined)?.message}
        tags={tags}
        activeTagId={activeTagId}
        onSelectTag={setActiveTagId}
      />

      <TagNotes activeTagId={activeTagId} activeTagName={tags.find((t) => t.id === activeTagId)?.name} />

      <CreateTagModal
        open={isCreateTagOpen}
        onOpenChange={setIsCreateTagOpen}
        groupName={group.name}
        name={newTagName}
        onNameChange={setNewTagName}
        onSubmit={handleCreateTag}
        isPending={createTag.isPending}
        errorMessage={createTag?.error?.message || undefined}
      />
    </section>
  );
};

export default GroupPage;
