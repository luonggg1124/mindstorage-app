import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { RegisterSchema } from "./schema";
import { registerSchema } from "./schema";
import { Stepper } from "./components/stepper";
import { FirstStep } from "./components/first-step";
import { SecondStep } from "./components/second-step";
import { ThirdStep } from "./components/third-step";
import { Link } from "react-router";
import clientPaths from "@/paths/client";

const steps = ["Thông tin cá nhân", "Tài khoản", "Xác thực email"];

const RegisterPage = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [gate, setGate] = useState<{ canProceed: boolean; errorText: string }>({
    canProceed: false,
    errorText: "",
  });

  const handleGateChange = useCallback((next: { canProceed: boolean; errorText: string }) => {
    setGate(next);
  }, []);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      gender: "MALE",
      hobbies: [],
      username: "",
      password: "",
      email: "",
      session: "",
      code: "",
      agree: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    setGate({ canProceed: false, errorText: "" });
  }, [step]);

  const stepContent = useMemo(() => {
    if (step === 0) return <FirstStep control={form.control} setValue={form.setValue} onGateChange={handleGateChange} />;
    if (step === 1) return <SecondStep control={form.control} setValue={form.setValue} onGateChange={handleGateChange} />;
    return <ThirdStep control={form.control} setValue={form.setValue} onGateChange={handleGateChange} />;
  }, [form.control, form.setValue, handleGateChange, step]);
  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        if (!gate.canProceed) {
          alert(gate.errorText || "Vui lòng kiểm tra lại thông tin.");
          return;
        }
        alert(
          `Đăng ký: ${values.fullName} | ${values.username} | ${values.email}${
            values.hobbies.length ? ` | Sở thích: ${values.hobbies.join(", ")}` : ""
          }`
        );
      })}
      className="space-y-4"
    >
      <Stepper current={step} steps={steps} />

      <div className="rounded-xl border border-white/10 bg-slate-950/15 p-4 backdrop-blur overflow-hidden">
        <div
          key={step}
          className={
            direction === "forward"
              ? "animate-in fade-in slide-in-from-right-4 duration-300"
              : "animate-in fade-in slide-in-from-left-4 duration-300"
          }
        >
          {stepContent}
        </div>
      </div>

      {gate.errorText && (
        <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          {gate.errorText}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => {
            setDirection("backward");
            setStep((s) => Math.max(0, s - 1));
          }}
          disabled={step === 0}
          className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Quay lại
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={() => {
              if (!gate.canProceed) {
                alert(gate.errorText || "Vui lòng kiểm tra lại thông tin.");
                return;
              }
              setDirection("forward");
              setStep((s) => Math.min(2, s + 1));
            }}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Tiếp tục
          </button>
        ) : (
          <button
            type="submit"
            disabled={!gate.canProceed}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Đăng ký
          </button>
        )}
      </div>

      <p className="text-center text-sm text-slate-300">
        Đã có tài khoản?{" "}
        <Link to={clientPaths.auth.login.getPath()} className="font-semibold text-indigo-300 hover:text-indigo-200">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
