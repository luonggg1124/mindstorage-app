import { useEffect, useMemo, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { useValidUsernamePassword } from "@/data/api/user";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/animate/loading-dots";
import { step2Schema, USERNAME_RE } from "../schema";
import type { RegisterSchema } from "../schema";

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
  const username = useWatch({ control, name: "username" }) ?? "";
  const password = useWatch({ control, name: "password" }) ?? "";
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

  const gate = useMemo(() => {
    const sync = step2Schema.safeParse({ username: trimmed, password: pw });
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
    trimmed,
  ]);

  useEffect(() => {
    onGateChange(gate);
  }, [gate, onGateChange]);

  return (
    <div className="space-y-4">
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
