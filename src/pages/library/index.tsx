import { useState } from "react";

import ScrollInfinite from "@/components/custom/scroll-infinite";
import { useMyAttachmentsInfinite, useMyAttachmentsTotalSize } from "@/data/api/attachment";
import type { IAttachment } from "@/data/models/attachment";
import { formatRelative } from "@/utils/date";
import { formatBytes } from "@/utils/format-bytes";

import { LibraryImagePreviewDialog } from "./components/library-image-preview-dialog";
import { FileIcon } from "lucide-react";

function isImageMime(mime: string) {
  return (mime ?? "").toLowerCase().startsWith("image/");
}

const LibraryPage = () => {
  const [preview, setPreview] = useState<IAttachment | null>(null);

  const totalSize = useMyAttachmentsTotalSize();
  const attachmentsInfinite = useMyAttachmentsInfinite({
    query: { size: 12 },
  });

  const handleItemActivate = (item: IAttachment) => {
    if (isImageMime(item.mimeType)) {
      setPreview(item);
      return;
    }
    window.open(item.fileUrl, "_blank", "noopener,noreferrer");
  };

  const totalBytes = totalSize.data?.totalSizeBytes ?? 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Thư viện ảnh</h1>
          <p className="mt-1 text-sm text-slate-400">Ảnh và tệp đính kèm của bạn.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          <span className="text-slate-500">Tổng dung lượng: </span>
          <span className="font-semibold tabular-nums text-slate-100">
            {totalSize.loading ? "…" : formatBytes(totalBytes)}
          </span>
        </div>
      </div>

      {attachmentsInfinite.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[200px] animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : null}

      {!attachmentsInfinite.loading && attachmentsInfinite.error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {(attachmentsInfinite.error as Error)?.message || "Không tải được danh sách đính kèm."}
        </div>
      ) : null}

      {!attachmentsInfinite.loading && !attachmentsInfinite.error && attachmentsInfinite.data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400">
          Chưa có tệp đính kèm nào.
        </div>
      ) : null}

      {!attachmentsInfinite.loading && attachmentsInfinite.data.length > 0 ? (
        <ScrollInfinite
          enabled
          hasNextPage={Boolean(attachmentsInfinite.hasNextPage)}
          isFetchingNextPage={attachmentsInfinite.fetchingNextPage}
          onLoadMore={() => attachmentsInfinite.fetchNextPage()}
          endMessage={<div className="py-4 text-center text-xs text-slate-500">Đã tải hết.</div>}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {attachmentsInfinite.data.map((item) => (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => handleItemActivate(item)}
                  className="group w-full overflow-hidden rounded-xl border border-white/10 bg-white/4 text-left shadow-sm backdrop-blur transition hover:border-indigo-400/40 hover:bg-white/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-white/5">
                    {isImageMime(item.mimeType) ? (
                      <img
                        src={item.fileUrl}
                        alt=""
                        className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex size-full flex-col items-center justify-center gap-2 bg-slate-900/80 px-3">
                        <FileIcon className="size-10 text-indigo-300/90" aria-hidden />
                        <span className="line-clamp-2 text-center text-xs text-slate-400">{item.originalName}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 px-3 py-2.5">
                    <p className="truncate text-xs text-slate-300/90" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Đã tạo{" "}
                      <span className="text-slate-200/95">{formatRelative(item.createdAt, "—")}</span>
                      {item.fileSize != null && Number.isFinite(item.fileSize) ? (
                        <>
                          {" · "}
                          <span className="tabular-nums">{formatBytes(item.fileSize)}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {attachmentsInfinite.fetchingNextPage ? (
            <div className="mt-4 text-center text-sm text-slate-300/80">Đang tải thêm…</div>
          ) : null}
        </ScrollInfinite>
      ) : null}

      <LibraryImagePreviewDialog open={preview != null} onOpenChange={(o) => !o && setPreview(null)} item={preview} />
    </section>
  );
};

export default LibraryPage;
