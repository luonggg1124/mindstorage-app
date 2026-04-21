import { useMemo, useState } from "react";

import type { ITopicByGroupDto } from "@/data/api/topic";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

type TopicTabsProps = {
  loading: boolean;
  errorMessage?: string;
  topics: ITopicByGroupDto[];
  activeTopicId: string | null;
  onSelectTopic: (id: string) => void;
  onEditTopic?: (topic: ITopicByGroupDto) => void;
  onDeleteTopic?: (topic: ITopicByGroupDto) => void;
};

export function TopicTabs({
  loading,
  errorMessage,
  topics,
  activeTopicId,
  onSelectTopic,
  onEditTopic,
  onDeleteTopic,
}: TopicTabsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const confirmDeleteTopic = useMemo(
    () => topics.find((t) => t.id === confirmDeleteId) ?? null,
    [topics, confirmDeleteId]
  );
  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 w-24 animate-pulse rounded bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
        <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className=" sm:p-5">
      {topics.length > 0 ? (
        <div className="border-b border-white/10">
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {topics.map((topic) => {
              const isActive = topic.id === activeTopicId;
              return (
                <Popover
                  key={topic.id}
                  open={hoveredId === topic.id && (Boolean(onEditTopic) || Boolean(onDeleteTopic))}
                  onOpenChange={(open) => {
                    if (!open && hoveredId === topic.id) setHoveredId(null);
                  }}
                >
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredId(topic.id)}
                    onMouseLeave={() => setHoveredId((curr) => (curr === topic.id ? null : curr))}
                  >
                    <PopoverAnchor asChild>
                      <button
                        type="button"
                        onClick={() => onSelectTopic(topic.id)}
                        className={[
                          "cursor-pointer whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors",
                          "border-b-2",
                          isActive
                            ? "border-indigo-400 text-indigo-200"
                            : "border-transparent text-slate-300/80 hover:text-slate-100",
                        ].join(" ")}
                      >
                        {topic.name}
                      </button>
                    </PopoverAnchor>

                    <PopoverContent
                      side="top"
                      align="center"
                      sideOffset={2}
                      className="w-auto flex-row items-center gap-2 p-2"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      {onEditTopic ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditTopic(topic);
                          }}
                        >
                          <PencilIcon className="size-3.5" />
                          <span>Sửa</span>
                        </Button>
                      ) : null}

                      {onDeleteTopic ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfirmDeleteId(topic.id);
                          }}
                        >
                          <Trash2Icon className="size-3.5" />
                          <span>Xóa</span>
                        </Button>
                      ) : null}
                    </PopoverContent>
                  </div>
                </Popover>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300/80">
          Chưa có chủ đề nào.
        </div>
      )}

      <AlertDialog
        open={confirmDeleteId != null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Có chắc xóa không?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp xóa chủ đề <span className="font-medium text-foreground">{confirmDeleteTopic?.name ?? "—"}</span>.
              Thao tác này hiện chỉ áp dụng trên UI (chưa gọi API).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDeleteId(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const t = confirmDeleteTopic;
                if (!t || !onDeleteTopic) return;
                onDeleteTopic(t);
                setConfirmDeleteId(null);
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
