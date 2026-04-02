"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseIcon?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
};

export default function Modal({
  open,
  onClose,
  children,
  showCloseIcon = true,
  className,
  overlayClassName,
  contentClassName,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      className={cn(
        "fixed inset-0 z-200 flex items-center  justify-center",
        "animate-in fade-in-0 duration-300",
        className
      )}
    >
      {showCloseIcon && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 cursor-pointer top-4 z-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 p-1.5 shadow-lg ring-offset-background transition-all hover:bg-background hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4 text-foreground" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-xs",
          overlayClassName
        )}
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-201 w-full max-w-lg bg-background rounded-lg shadow-lg border p-6 mx-4",
          "animate-in fade-in-0 zoom-in-95 duration-300",
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
