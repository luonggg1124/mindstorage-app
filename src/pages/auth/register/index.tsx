import { FormEvent, useMemo, useState } from "react";

import type { RegisterDraft } from "./components/types";
import { Stepper } from "./components/stepper";
import { FirstStep } from "./components/first-step";
import { SecondStep } from "./components/second-step";
import { ThirdStep } from "./components/third-step";

const steps = ["Thông tin cá nhân", "Tài khoản", "Xác thực email"];

const RegisterPage = () => {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<RegisterDraft>({
    fullName: "",
    gender: "",
    hobbies: [],
    username: "",
    password: "",
    email: "",
    emailCode: "",
    emailVerified: false,
    agree: false,
  });

  const [sentCode, setSentCode] = useState<string | null>(null);
  const isCodeSent = Boolean(sentCode);

  const canGoNext = useMemo(() => {
    if (step === 0) {
      return draft.fullName.trim().length > 0 && Boolean(draft.gender);
    }
    if (step === 1) {
      const u = draft.username.trim();
      const usernameOk = /^[a-zA-Z0-9_]{4,20}$/.test(u);
      const pwOk = draft.password.length >= 6;
      return usernameOk && pwOk;
    }
    if (step === 2) {
      const emailOk = /^\S+@\S+\.\S+$/.test(draft.email.trim());
      return emailOk && draft.emailVerified && draft.agree;
    }
    return false;
  }, [draft, step]);

  const stepError = useMemo(() => {
    if (step === 0) {
      if (!draft.fullName.trim()) return "Vui lòng nhập họ tên.";
      if (!draft.gender) return "Vui lòng chọn giới tính.";
      return "";
    }
    if (step === 1) {
      const u = draft.username.trim();
      if (!/^[a-zA-Z0-9_]{4,20}$/.test(u)) {
        return "Username chỉ gồm chữ/số/_ và dài 4–20 ký tự.";
      }
      if (draft.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
      return "";
    }
    if (step === 2) {
      if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) return "Email không hợp lệ.";
      if (!isCodeSent) return "Vui lòng bấm “Gửi mã” để nhận mã xác nhận.";
      if (!draft.emailVerified) return "Vui lòng xác nhận email trước khi đăng ký.";
      if (!draft.agree) return "Vui lòng đồng ý chính sách.";
      return "";
    }
    return "";
  }, [draft, isCodeSent, step]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canGoNext) {
      alert(stepError || "Vui lòng kiểm tra lại thông tin.");
      return;
    }
    alert(
      `Đăng ký: ${draft.fullName} | ${draft.username} | ${draft.email}${
        draft.hobbies.length ? ` | Sở thích: ${draft.hobbies.join(", ")}` : ""
      }`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Stepper current={step} steps={steps} />

      <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
        {step === 0 && <FirstStep value={draft} onChange={setDraft} />}
        {step === 1 && <SecondStep value={draft} onChange={setDraft} />}
        {step === 2 && (
          <ThirdStep
            value={draft}
            onChange={setDraft}
            isCodeSent={isCodeSent}
            onSendCode={() => {
              if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) {
                alert("Vui lòng nhập email hợp lệ trước.");
                return;
              }
              const code = Math.floor(100000 + Math.random() * 900000).toString();
              setSentCode(code);
              setDraft((current) => ({ ...current, emailVerified: false, emailCode: "" }));
              alert(`Mã xác nhận (demo): ${code}`);
            }}
            onVerifyCode={() => {
              if (!sentCode) return;
              if (draft.emailCode.trim() === sentCode) {
                setDraft((current) => ({ ...current, emailVerified: true }));
                alert("Xác nhận email thành công.");
              } else {
                setDraft((current) => ({ ...current, emailVerified: false }));
                alert("Mã xác nhận không đúng.");
              }
            }}
          />
        )}
      </div>

      {stepError && (
        <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          {stepError}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Quay lại
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={() => {
              if (!canGoNext) {
                alert(stepError || "Vui lòng kiểm tra lại thông tin.");
                return;
              }
              setStep((s) => Math.min(2, s + 1));
            }}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Tiếp tục
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canGoNext}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Đăng ký
          </button>
        )}
      </div>
    </form>
  );
};

export default RegisterPage;
