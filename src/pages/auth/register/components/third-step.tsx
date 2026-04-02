import type { RegisterDraft } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ThirdStepProps = {
  value: RegisterDraft;
  onChange: (next: RegisterDraft) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
  isCodeSent: boolean;
};

export function ThirdStep({
  value,
  onChange,
  onSendCode,
  onVerifyCode,
  isCodeSent,
}: ThirdStepProps) {
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
            value={value.email}
            onChange={(e) =>
              onChange({
                ...value,
                email: e.target.value,
                emailVerified: false,
                emailCode: "",
              })
            }
            required
            className="h-9 rounded-full border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/30"
            placeholder="example@gmail.com"
          />
          <Button
            type="button"
            onClick={onSendCode}
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800/60"
          >
            Gửi mã
          </Button>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Nhấn “Gửi mã” để nhận mã xác nhận (demo: mã được tạo ngay trong app).
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
            value={value.emailCode}
            onChange={(e) => onChange({ ...value, emailCode: e.target.value })}
            required
            disabled={!isCodeSent}
            className="h-9 rounded-full border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/30 disabled:opacity-50"
            placeholder="Nhập mã 6 số"
          />
          <Button
            type="button"
            onClick={onVerifyCode}
            disabled={!isCodeSent}
            size="sm"
            className="h-9 rounded-full bg-indigo-500 text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xác nhận
          </Button>
        </div>

        {value.emailVerified ? (
          <p className="mt-2 text-xs text-emerald-300">Email đã được xác nhận.</p>
        ) : (
          <p className="mt-2 text-xs text-slate-400">
            {isCodeSent ? "Vui lòng nhập mã và bấm “Xác nhận”." : "Bạn cần gửi mã trước."}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={value.agree}
          onChange={(e) => onChange({ ...value, agree: e.target.checked })}
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500"
        />
        Tôi đồng ý các điều khoản và chính sách quyền riêng tư.
      </label>
    </div>
  );
}

