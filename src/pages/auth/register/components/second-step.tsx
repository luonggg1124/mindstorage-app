import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { useValidUsernamePassword } from "@/data/api/user";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/animate/loading-dots";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { step2Schema, USERNAME_RE } from "../schema";
import type { RegisterSchema } from "../schema";

const intendedUseSuggestions = [
  "Học tập",
  "Giải trí",
  "Ghi nhớ",
  "Công việc",
  "Theo dõi sức khỏe",
  "Lập kế hoạch",
  "Mua sắm",
  "Kết nối xã hội",
] as const;

const intendedPresetLower = new Set(intendedUseSuggestions.map((s) => s.toLowerCase()));

const DEBOUNCE_MS = 500;

type SecondStepProps = {
  control: Control<RegisterSchema>;
  setValue: UseFormSetValue<RegisterSchema>;
  onGateChange: (next: { canProceed: boolean; errorText: string }) => void;
};

export function SecondStep({
  control,
  setValue,
  onGateChange,
}: SecondStepProps) {
  const [intendedModalOpen, setIntendedModalOpen] = useState(false);
  const [intendedDraft, setIntendedDraft] = useState("");
  const [extraIntendedSuggestions, setExtraIntendedSuggestions] = useState<string[]>([]);

  const username = useWatch({ control, name: "username" }) ?? "";
  const password = useWatch({ control, name: "password" }) ?? "";
  const intendedUse = useWatch({ control, name: "intendedUse" }) ?? [];
  const trimmed = username.trim();
  const debouncedUsername = useDebounce(trimmed, DEBOUNCE_MS);
  const pw = password;
  const debouncedPassword = useDebounce(pw, DEBOUNCE_MS);
  const { mutateAsync, data: result, error, isPending, reset } = useValidUsernamePassword();
  const requestIdRef = useRef(0);

  useEffect(() => {
    const usernameOk = USERNAME_RE.test(debouncedUsername);
    const pwOk = debouncedPassword.length >= 8;
    const settled = trimmed === debouncedUsername && pw === debouncedPassword;

    if (!usernameOk || !pwOk || !settled) {
      reset();
      return;
    }

    const id = ++requestIdRef.current;
    (async () => {
      await mutateAsync({ username: debouncedUsername, password: debouncedPassword });
      // If a newer request was started, ignore this one.
      if (id !== requestIdRef.current) return;
    })();
  }, [debouncedPassword, debouncedUsername, mutateAsync, pw, reset, trimmed]);

  const formatOk = USERNAME_RE.test(trimmed);
  const pwOk = pw.length >= 8;
  const settled = trimmed === debouncedUsername && pw === debouncedPassword;
  const waitingForDebounce = (trimmed.length > 0 || pw.length > 0) && !settled;
  const apiLoading = formatOk && pwOk && settled && isPending;
  const checkSettled = formatOk && pwOk && settled && !isPending;
  const isValid = checkSettled && !error && result?.data?.valid === true;
  const isInvalid = checkSettled && (Boolean(error) || result?.data?.valid === false);

  const addIntendedFromPick = (raw: string) => {
    const item = raw.trim();
    if (!item) return;
    if (intendedUse.some((u) => u.toLowerCase() === item.toLowerCase())) return;
    setValue("intendedUse", [...intendedUse, item], { shouldDirty: true, shouldValidate: true });
  };

  const addToIntendedPool = () => {
    const t = intendedDraft.trim();
    if (!t) return;
    if (intendedPresetLower.has(t.toLowerCase())) return;
    if (extraIntendedSuggestions.some((e) => e.toLowerCase() === t.toLowerCase())) return;
    setExtraIntendedSuggestions((prev) => [...prev, t]);
    setIntendedDraft("");
  };

  const removeExtraIntended = (item: string) => {
    setExtraIntendedSuggestions((prev) => prev.filter((x) => x !== item));
  };

  const handleOpenIntendedModal = (open: boolean) => {
    setIntendedModalOpen(open);
    if (open) setIntendedDraft("");
  };

  const combinedIntendedSuggestions = useMemo(
    () => [...intendedUseSuggestions, ...extraIntendedSuggestions],
    [extraIntendedSuggestions],
  );

  const gate = useMemo(() => {
    const sync = step2Schema.safeParse({
      intendedUse,
      username: trimmed,
      password: pw,
    });
    if (!sync.success) return { canProceed: false, errorText: sync.error.issues[0]?.message ?? "Vui lòng kiểm tra lại." };
    if (waitingForDebounce) return { canProceed: false, errorText: "Đang chờ bạn nhập xong…" };
    if (apiLoading) return { canProceed: false, errorText: "Đang kiểm tra…" };
    if (error?.message) return { canProceed: false, errorText: error.message };
    if (isInvalid) return { canProceed: false, errorText: "Tài khoản/mật khẩu không hợp lệ." };
    if (isValid) return { canProceed: true, errorText: "" };
    return { canProceed: false, errorText: "Vui lòng chờ kiểm tra." };
  }, [
    apiLoading,
    formatOk,
    isInvalid,
    isValid,
    pw,
    waitingForDebounce,
    error?.message,
    intendedUse,
    trimmed,
  ]);

  useEffect(() => {
    onGateChange(gate);
  }, [gate, onGateChange]);

  const intendedSync = step2Schema.pick({ intendedUse: true }).safeParse({ intendedUse });
  const intendedError = intendedSync.success ? "" : intendedSync.error.issues[0]?.message ?? "";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-slate-200">
            Mục đích sử dụng <span className="text-xs font-medium text-amber-200/90">(bắt buộc)</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800"
            onClick={() => handleOpenIntendedModal(true)}
          >
            Thêm
          </Button>
        </div>

        <div className="min-h-10">
          {intendedUse.length > 0 && (
            <div className="max-h-24 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                {intendedUse.map((item) => (
                  <span
                    key={item}
                    className="relative inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
                  >
                    <span className="pr-4">{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "intendedUse",
                          intendedUse.filter((u) => u !== item),
                          { shouldDirty: true, shouldValidate: true },
                        )
                      }
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                      aria-label={`Xóa mục đích ${item}`}
                      title="Xóa"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className={`h-4 text-xs ${intendedError ? "font-medium text-red-400" : "text-slate-400"}`}>
          {intendedError || "Chọn ít nhất một mục (ví dụ: học tập, giải trí, ghi nhớ…)."}
        </p>
      </div>

      <Dialog open={intendedModalOpen} onOpenChange={handleOpenIntendedModal}>
        <DialogContent className="border-slate-800 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gợi ý mục đích sử dụng</DialogTitle>
            <DialogDescription className="text-slate-400">
              Nhập từ khóa rồi bấm &quot;Thêm mục đích&quot; để đưa vào danh sách gợi ý. Bấm một gợi ý để chọn (có thể chọn nhiều). Cần ít nhất một mục đã chọn để tiếp tục.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex h-10 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-900 ring-offset-slate-950 focus-within:ring-2 focus-within:ring-indigo-500/30">
              <Input
                type="text"
                value={intendedDraft}
                onChange={(e) => setIntendedDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToIntendedPool();
                  }
                }}
                className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent px-4 text-white shadow-none placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Ví dụ: nghiên cứu"
              />
              <Button
                type="button"
                disabled={!intendedDraft.trim()}
                onClick={addToIntendedPool}
                className="h-10 shrink-0 rounded-none border-0 border-l border-slate-700 bg-indigo-500 px-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 sm:px-4"
              >
                Thêm mục đích
              </Button>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">Chọn từ gợi ý</p>
              <div className="flex flex-wrap gap-2">
                {combinedIntendedSuggestions.map((item) => {
                  const isPreset = intendedUseSuggestions.includes(
                    item as (typeof intendedUseSuggestions)[number],
                  );
                  const selected = intendedUse.some((u) => u.toLowerCase() === item.toLowerCase());
                  return (
                    <span key={`${item}-${isPreset ? "p" : "e"}`} className="inline-flex items-center gap-0.5">
                      <Button
                        type="button"
                        variant={selected ? "secondary" : "outline"}
                        size="xs"
                        disabled={selected}
                        onClick={() => addIntendedFromPick(item)}
                        className={
                          selected
                            ? "rounded-full opacity-60"
                            : "rounded-full border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800/60"
                        }
                      >
                        {item}
                      </Button>
                      {!isPreset && (
                        <button
                          type="button"
                          onClick={() => removeExtraIntended(item)}
                          className="rounded-full p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                          aria-label={`Xóa gợi ý ${item}`}
                          title="Xóa khỏi gợi ý"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full border-slate-600"
              onClick={() => handleOpenIntendedModal(false)}
            >
              Hoàn thành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="username">
          Tên tài khoản
        </label>
        <div className="relative">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setValue("username", e.target.value, { shouldDirty: true, shouldValidate: true })}
            required
            disabled={apiLoading}
            aria-busy={apiLoading}
            className={cn(
              "w-full rounded-full border border-slate-700 bg-slate-900 p-3 pr-10 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30",
              apiLoading && "cursor-wait opacity-80",
              isInvalid && "border-red-500/60 focus:border-red-500/60"
            )}
            placeholder="luong.1124"
            autoCapitalize="none"
            autoCorrect="off"
          />
          {apiLoading && (
            <Loader2
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400"
              aria-hidden
            />
          )}
        </div>

        {apiLoading ? (
          <p className="mt-1 text-xs text-slate-400">
            Đang kiểm tra tên tài khoản <LoadingDots />
          </p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">Gợi ý: 4–20 ký tự, chỉ chữ/số và dấu gạch dưới.</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="password">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setValue("password", e.target.value, { shouldDirty: true, shouldValidate: true })}
          required
          className="w-full rounded-full border border-slate-700 bg-slate-900 p-3 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
          placeholder="********"
        />
        <p className="mt-1 text-xs text-slate-400">Gợi ý: nên dùng tối thiểu 8 ký tự.</p>
      </div>
    </div>
  );
}
