import * as React from "react";
import { useNavigate } from "react-router";

import clientPaths from "@/paths/client";
import { otherProfiles } from "@/pages/profile/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function FriendSearchDialogTrigger() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return otherProfiles;
    return otherProfiles.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.role.toLowerCase().includes(query) ||
        p.major.toLowerCase().includes(query)
      );
    });
  }, [q]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
      >
        Tìm kiếm bạn bè
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQ("");
        }}
      >
        <DialogContent className="sm:max-w-lg border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur">
          <DialogHeader>
            <DialogTitle>Tìm kiếm bạn bè</DialogTitle>
            <DialogDescription className="text-slate-300/70">
              Tìm theo tên hoặc vai trò. Chọn một người để mở public profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nhập tên, role..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 outline-none"
                autoFocus
              />
            </div>

            <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate(clientPaths.profile.detail.getPath(p.id));
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-100">{p.name}</div>
                      <div className="truncate text-xs text-slate-300/70">
                        {p.role} · {p.major}
                      </div>
                    </div>
                    <span className="text-xs text-slate-300/70">Mở</span>
                  </button>
                ))
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300/70">
                  Không có kết quả.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

