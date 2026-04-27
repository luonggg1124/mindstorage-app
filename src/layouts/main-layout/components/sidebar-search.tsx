import * as React from "react";
import { Link } from "react-router";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type SidebarSearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SidebarSearch({ open, onOpenChange }: SidebarSearchProps) {
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const normalized = q.trim().toLowerCase();

  const recent = [
    { label: "UTC - Java 1", hint: "Space" },
    { label: "Tuần 2", hint: "Group" },
    { label: "React Query", hint: "Note" },
  ].filter((x) => (normalized ? x.label.toLowerCase().includes(normalized) : true));

  const suggestions = [
    { label: "Spaces", hint: "Đi đến danh sách", href: "/spaces" },
    { label: "Trang chủ", hint: "Dashboard", href: "/" },
  ].filter((x) => (normalized ? x.label.toLowerCase().includes(normalized) : true));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[360px] border-white/10 bg-slate-950/80 px-4 py-4 text-slate-100 backdrop-blur"
      >
        <SheetHeader>
          <SheetTitle className="text-slate-100">Tìm kiếm</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm spaces, groups, notes..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 outline-none"
              autoFocus
            />
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-300/80">Gần đây</p>
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="text-xs text-slate-300/70 hover:text-slate-200"
                >
                  Xóa
                </button>
              </div>

              <div className="space-y-2">
                {recent.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-100">{item.label}</div>
                      <div className="text-xs text-slate-300/70">{item.hint}</div>
                    </div>
                    <span className="text-xs text-slate-300/70">Mở</span>
                  </button>
                ))}
                {recent.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300/70">
                    Không có kết quả.
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-slate-300/80">Gợi ý</p>
              <div className="space-y-2">
                {suggestions.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-100">{item.label}</div>
                      <div className="text-xs text-slate-300/70">{item.hint}</div>
                    </div>
                    <span className="text-xs text-slate-300/70">Đi</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

