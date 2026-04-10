import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

import clientPaths from "@/paths/client";
import { useDetailGroup } from "@/data/api/group";
import { formatRelative } from "@/utils/date";
import { useCreateTopic, useTopicsByGroup } from "@/data/api/topic";
import { CreateTopicModal } from "./components/create-topic-modal";
import { TopicTabs } from "./components/topic-tabs";
import { TopicNotes } from "./components/topic-notes";
import { EditTopicModal } from "./components/edit-topic-modal";

const GroupPage = () => {
  const { id } = useParams();
  const groupDetail = useDetailGroup(id);
  const topicsQuery = useTopicsByGroup(id);
  const createTopic = useCreateTopic();
  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
  const [editTopic, setEditTopic] = useState<null | { id: number; name: string }>(null);
  const [editDraft, setEditDraft] = useState<{ name: string }>({ name: "" });
  const [topicNameOverrides, setTopicNameOverrides] = useState<Record<number, string>>({});
  const [deletedTopicIds, setDeletedTopicIds] = useState<Record<number, true>>({});

  const topics = useMemo(() => {
    const raw = topicsQuery.data ?? [];
    return raw
      .filter((t) => !deletedTopicIds[t.id])
      .map((t) => ({ ...t, name: topicNameOverrides[t.id] ?? t.name }));
  }, [topicsQuery.data, topicNameOverrides, deletedTopicIds]);

  // keep activeTopicId stable with current topic list
  useEffect(() => {
    if (topics.length === 0) {
      if (activeTopicId !== null) setActiveTopicId(null);
      return;
    }
    if (activeTopicId != null && topics.some((t) => t.id === activeTopicId)) return;
    setActiveTopicId(topics[0]?.id ?? null);
  }, [topics, activeTopicId]);

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

  const handleCreateTopic = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newTopicName.trim();
    if (!name) return;
    const groupId = Number(id);
    if (!Number.isFinite(groupId)) return;
    const res = await createTopic.mutateAsync({ name, groupId });
    if (res.error) return;
    setNewTopicName("");
    setIsCreateTopicOpen(false);
  };

  const handleDeleteTopic = (topic: { id: number }) => {
    setDeletedTopicIds((prev) => ({ ...prev, [topic.id]: true }));
    if (activeTopicId === topic.id) {
      setActiveTopicId(topics.filter((t) => t.id !== topic.id)[0]?.id ?? null);
    }
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
              onClick={() => setIsCreateTopicOpen(true)}
              className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Tạo chủ đề
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

      <TopicTabs
        loading={topicsQuery.loading}
        errorMessage={topicsQuery?.error?.message || undefined}
        topics={topics}
        activeTopicId={activeTopicId}
        onSelectTopic={setActiveTopicId}
        onEditTopic={(topic) => {
          setEditTopic({ id: topic.id, name: topic.name });
          setEditDraft({ name: topic.name });
        }}
        onDeleteTopic={handleDeleteTopic}
      />

      <TopicNotes activeTopicId={activeTopicId} activeTopicName={topics.find((t) => t.id === activeTopicId)?.name} />

      <CreateTopicModal
        open={isCreateTopicOpen}
        onOpenChange={setIsCreateTopicOpen}
        groupName={group.name}
        name={newTopicName}
        onNameChange={setNewTopicName}
        onSubmit={handleCreateTopic}
        isPending={createTopic.isPending}
        errorMessage={createTopic?.error?.message || undefined}
      />

      <EditTopicModal
        open={Boolean(editTopic)}
        onOpenChange={(open) => {
          if (!open) setEditTopic(null);
        }}
        value={editDraft}
        onChange={setEditDraft}
        onSubmit={(event) => {
          event.preventDefault();
          const name = editDraft.name.trim();
          if (!name || !editTopic) return;
          setTopicNameOverrides((prev) => ({ ...prev, [editTopic.id]: name }));
          setEditTopic(null);
        }}
      />
    </section>
  );
};

export default GroupPage;
