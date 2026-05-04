import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/data/api/auth";
import { step3Schema } from "../schema";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { RegisterSchema } from "../schema";

type ThirdStepProps = {
  control: Control<RegisterSchema>;
  setValue: UseFormSetValue<RegisterSchema>;
  onGateChange: (next: { canProceed: boolean; errorText: string }) => void;
};

export function ThirdStep({
  control,
  setValue,
  onGateChange,
}: ThirdStepProps) {
  const { verifyEmail, verifyEmailState } = useAuth();
  const email = useWatch({ control, name: "email" }) ?? "";
  const session = useWatch({ control, name: "session" }) ?? "";
  const code = useWatch({ control, name: "code" }) ?? "";
  const agree = useWatch({ control, name: "agree" }) ?? false;
  const isCodeSent = Boolean(session);
  const [cooldownSec, setCooldownSec] = useState(0);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const t = window.setInterval(() => {
      setCooldownSec((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [cooldownSec]);

  const gate = useMemo(() => {
    if (verifyEmailState.error?.message) return { canProceed: false, errorText: verifyEmailState.error.message };
    const res = step3Schema.safeParse({
      email,
      session,
      code,
      agree,
    });
    return {
      canProceed: res.success,
      errorText: res.success ? "" : res.error.issues[0]?.message ?? "Vui lòng kiểm tra lại.",
    };
  }, [agree, email, session, code, verifyEmailState.error?.message]);

  useEffect(() => {
    onGateChange(gate);
  }, [gate, onGateChange]);

  const canSendCode = !verifyEmailState.isLoading && cooldownSec === 0;

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1 text-slate-200" htmlFor="email">
          Email
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              setValue("email", e.target.value, { shouldDirty: true, shouldValidate: true })
            }
            required
            className="h-9 rounded-full border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/30"
            placeholder="example@gmail.com"
          />
          <Button
            type="button"
            disabled={!canSendCode}
            onClick={async () => {
              if (!/^\S+@\S+\.\S+$/.test(email.trim())) return;
              // Chống spam: khóa 1 phút 30 giây sau khi bấm gửi
              setCooldownSec(90);
              const data = await verifyEmail(email.trim());
              if (!data?.session) return;
              setValue("session", data.session, { shouldDirty: true, shouldValidate: true });
              setValue("code", "", { shouldDirty: true, shouldValidate: true });
            }}
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800/60"
          >
            {cooldownSec > 0 ? `Gửi lại (${cooldownSec}s)` : "Gửi mã"}
          </Button>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Nhấn “Gửi mã” để nhận mã xác nhận.
        </p>
      </div>

      <div>
        <Label className="mb-1 text-slate-200" htmlFor="emailCode">
          Mã xác nhận email
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="emailCode"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setValue("code", e.target.value, { shouldDirty: true, shouldValidate: true })}
            required
            disabled={!isCodeSent}
            className="h-9 rounded-full border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/30 disabled:opacity-50"
            placeholder="Nhập mã 6 số"
          />
          <Button
            type="button"
            onClick={() => {}}
            disabled={!isCodeSent}
            size="sm"
            className="h-9 rounded-full bg-indigo-500 text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xác nhận
          </Button>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          {isCodeSent ? "Vui lòng nhập mã (demo) sau đó tick đồng ý để tiếp tục." : "Bạn cần gửi mã trước."}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setValue("agree", e.target.checked, { shouldDirty: true, shouldValidate: true })}
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500"
        />
        Tôi đồng ý các điều khoản và chính sách quyền riêng tư.
      </label>
    </div>
  );
}

