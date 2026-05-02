import { SubmitEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

import clientPaths from "@/paths/client";
import { useDetailGroup } from "@/data/api/group";
import { formatRelative } from "@/utils/date";
import { useCreateTopic, useTopicsByGroup, useUpdateTopic } from "@/data/api/topic";
import { CreateTopicModal } from "./components/create-topic-modal";
import { TopicTabs } from "./components/topic-tabs";
import TopicNotes from "./components/topic-notes";
import { EditTopicModal } from "./components/edit-topic-modal";


const GroupPage = () => {
  const { id } = useParams();
  const groupDetail = useDetailGroup(id);
  const topicsQuery = useTopicsByGroup(id);
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [editTopic, setEditTopic] = useState<null | { id: string; name: string }>(null);
  const [editDraft, setEditDraft] = useState<{ name: string }>({ name: "" });
  const [deletedTopicIds, setDeletedTopicIds] = useState<Record<string, true>>({});

  const topics = useMemo(() => {
    const raw = topicsQuery.data ?? [];
    return raw
      .filter((t) => !deletedTopicIds[t.id])
      .map((t) => ({ ...t }));
  }, [topicsQuery.data, deletedTopicIds]);

  // keep activeTopicId stable with current topic list
  useEffect(() => {
    if (topics.length === 0) {
      if (activeTopicId !== null) setActiveTopicId(null);
      return;
    }
    if (activeTopicId != null && topics.some((t) => t.id === activeTopicId)) return;
    setActiveTopicId(topics[0]?.id ?? null);
  }, [topics, activeTopicId]);

 

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

  if (groupDetail.error || !groupDetail.data || !id?.trim()) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Không tìm thấy group</h1>
        <p className="text-slate-300/80">
          {groupDetail?.error?.message || "Group không tồn tại hoặc bạn không có quyền xem."}
        </p>
        <Link
          to={clientPaths.space.list.getPath()}
          className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          Quay lại
        </Link>
      </section>
    );
  }

  const group = groupDetail.data;

  const handleCreateTopic = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newTopicName.trim();
    if (!name) return;
    const groupId = String(id ?? "").trim();
    if (!groupId) return;

    try {
      await createTopic.mutateAsync({ name, groupId });

      setNewTopicName("");
      setIsCreateTopicOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTopic = (topic: { id: string }) => {
    setDeletedTopicIds((prev) => ({ ...prev, [topic.id]: true }));
    if (activeTopicId === topic.id) {
      setActiveTopicId(topics.filter((t) => t.id !== topic.id)[0]?.id ?? null);
    }
  };
  const handleUpdateTopic = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = editDraft.name.trim();
    if (!name || !editTopic) return;
    const groupId = String(id ?? "").trim();
    if (!groupId) return;

    try {
      await updateTopic.mutateAsync({ id: editTopic.id, name, groupId });
      setEditTopic(null);
      topicsQuery.refetch?.();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section >
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-300/70">Nhóm</p>
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
              Quay lại
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

      <TopicNotes
        activeTopicId={activeTopicId}
        activeTopicName={topics.find((t) => t.id === activeTopicId)?.name} />

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
        onSubmit={handleUpdateTopic}
        isPending={updateTopic.isPending}
        errorMessage={updateTopic.error?.message || undefined}
      />
    </section>
  );
};

export default GroupPage;
