import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { findGroupById, findSpaceByGroupId } from "@/data/workspace";
import { cn } from "@/lib/utils";
import { CreateChildNoteModal } from "./components/create-child-note-modal";
import clientPaths from "@/paths/client";

const noteStatuses = [
  { label: "To do", className: "bg-slate-100 text-slate-700" },
  { label: "In progress", className: "bg-amber-100 text-amber-700" },
  { label: "Done", className: "bg-emerald-100 text-emerald-700" },
];

const GroupPage = () => {
  const { id } = useParams();
  const group = findGroupById(id);
  const parentSpace = findSpaceByGroupId(id);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [notes, setNotes] = useState(group?.notes ?? []);
  const [newChildNote, setNewChildNote] = useState<{
    parentId: string;
    title: string;
    summary: string;
  }>({
    parentId: group?.notes[0]?.id ?? "",
    title: "",
    summary: "",
  });

  useEffect(() => {
    setNotes(group?.notes ?? []);
    setSelectedNoteId(null);
    setIsAddNoteOpen(false);
    setNewChildNote({
      parentId: group?.notes[0]?.id ?? "",
      title: "",
      summary: "",
    });
  }, [group?.id]);

  if (!group) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Không tìm thấy group</h1>
        <p className="text-muted-foreground">Group bạn chọn không tồn tại.</p>
        <Link
          to={clientPaths.space.list.getPath()}
          className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Quay lại spaces
        </Link>
      </section>
    );
  }

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  const handleCreateChildNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newChildNote.title.trim();
    if (!title || !newChildNote.parentId) {
      return;
    }

    const createdChildNote = {
      id: `${newChildNote.parentId}-${Date.now().toString().slice(-4)}`,
      title,
      summary: newChildNote.summary.trim() || "Note mới vừa được tạo.",
      status: "To do" as const,
    };

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === newChildNote.parentId
          ? {
              ...note,
              children: [createdChildNote, ...note.children],
              updatedAt: new Intl.DateTimeFormat("vi-VN").format(new Date()),
            }
          : note
      )
    );

    setIsAddNoteOpen(false);
    setSelectedNoteId(newChildNote.parentId);
    setNewChildNote({
      parentId: newChildNote.parentId,
      title: "",
      summary: "",
    });
  };

  return (
    <>
      <section className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-muted-foreground">Group Workspace</p>

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
              <p className="mt-2 text-muted-foreground">
                {parentSpace ? `Thuộc space ${parentSpace.name}. ` : ""}
                {group.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-xs text-muted-foreground">Tổng note</p>
                <p className="text-2xl font-semibold">{notes.length}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddNoteOpen(true)}
                disabled={notes.length === 0}
                className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Thêm note
              </button>

              <Link
                to={parentSpace ? `/spaces/${parentSpace.id}` : "/spaces"}
                className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Quay lại space
              </Link>
            </div>
          </div>
        </div>

        {notes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {notes.map((note, index) => {
              const status = noteStatuses[index % noteStatuses.length];

              return (
                <article
                  key={note.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                      {note.id}
                    </span>
                    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium", status.className)}>
                      {status.label}
                    </span>
                  </div>

                  <h2 className="text-base font-semibold">{note.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    <span dangerouslySetInnerHTML={{ __html: note.summary }} />
                  </p>

                  <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm leading-6 text-foreground backdrop-blur">
                    <p className="line-clamp-4">{note.content}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{note.updatedAt}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedNoteId(note.id)}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-medium transition hover:bg-white/10"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-sm text-muted-foreground backdrop-blur">
            Group này hiện chưa có note con nào.
          </div>
        )}
      </section>

      <CreateChildNoteModal
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        notes={notes}
        value={newChildNote}
        onChange={(next) => setNewChildNote(next)}
        onSubmit={handleCreateChildNote}
      />

      <Dialog
        open={Boolean(selectedNote)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNoteId(null);
          }
        }}
      >
        {selectedNote ? (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedNote.title}</DialogTitle>
              <DialogDescription>
                <div dangerouslySetInnerHTML={{ __html: selectedNote.summary }} />
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Task ID</p>
                  <p className="mt-1 font-medium">{selectedNote.id}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Nhóm</p>
                  <p className="mt-1 font-medium">{group.name}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Cập nhật</p>
                  <p className="mt-1 font-medium">{selectedNote.updatedAt}</p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 text-sm leading-6 text-foreground">
                {selectedNote.content}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Các note con</h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedNote.children.length > 0 ? (
                    selectedNote.children.map((child) => (
                      <div key={child.id} className="rounded-lg border p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{child.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{child.summary}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground sm:col-span-2">
                      Thẻ này hiện chưa có note con.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter showCloseButton />
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
};

export default GroupPage;
