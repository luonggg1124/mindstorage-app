import { TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IAttachment } from "@/data/models/attachment";
import { formatRelative } from "@/utils/date";
import { cn } from "@/lib/utils";
import { Maximize2Icon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

function ZoomToolbar({ className }: { className?: string }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-slate-950/90 px-2 py-1.5 shadow-lg backdrop-blur",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-9 text-slate-200 hover:bg-white/10"
        onClick={() => zoomOut()}
        aria-label="Thu nhỏ"
      >
        <ZoomOutIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="min-w-18 px-2 text-xs font-medium text-slate-300 hover:bg-white/10"
        onClick={() => resetTransform()}
        aria-label="Đặt lại vị trí và mức zoom"
      >
        <Maximize2Icon className="mr-1 size-3.5 opacity-80" />
        Vừa khung
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-9 text-slate-200 hover:bg-white/10"
        onClick={() => zoomIn()}
        aria-label="Phóng to"
      >
        <ZoomInIcon className="size-4" />
      </Button>
    </div>
  );
}

type LibraryImagePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: IAttachment | null;
};

export function LibraryImagePreviewDialog({ open, onOpenChange, item }: LibraryImagePreviewDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[95vh] max-w-[min(96vw,1120px)] gap-0 overflow-hidden border-white/10 bg-slate-950 p-0 text-slate-100 sm:max-w-[min(96vw,1120px)]"
      >
        <DialogHeader className="border-b border-white/10 px-4 py-3 text-left">
          <DialogTitle className="sr-only">Xem ảnh</DialogTitle>
          {(item.originalName ?? "").trim() ? (
            <p className="truncate text-sm font-medium text-slate-200">{item.originalName}</p>
          ) : null}
          <DialogDescription className="text-sm text-slate-400">
            Đã tạo{" "}
            <span className="font-medium text-slate-200">{formatRelative(item.createdAt, "—")}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[min(78vh,820px)] w-full bg-black/60">
          <TransformWrapper
            key={item.id}
            initialScale={1}
            minScale={0.35}
            maxScale={8}
            centerOnInit
            wheel={{ step: 0.12 }}
            doubleClick={{ mode: "reset" }}
            panning={{ velocityDisabled: true }}
          >
            <ZoomToolbar />
            <TransformComponent
              wrapperClass="!h-full !w-full"
              contentClass="!flex !h-full !w-full !items-center !justify-center"
            >
              <img
                src={item.fileUrl}
                alt=""
                className="max-h-[min(78vh,820px)] max-w-full object-contain select-none"
                draggable={false}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
}
