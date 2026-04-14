import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";

const APP_NAME = "Java Assignment";

const FACTS = [
  "Bạn có biết: Hồ Chí Minh (1890–1969) quê ở Kim Liên, Nghệ An — Người đã đọc Tuyên ngôn độc lập nước Việt Nam Dân chủ Cộng hòa ngày 2 tháng 9 năm 1945 tại Ba Đình.",
  "Bạn có biết: Lê Thánh Tông (1442–1497) trị vì gần 40 năm; thời ông, Đại Việt mở rộng biên cương và ban hành bộ luật Hồng Đức.",
  "Bạn có biết: Trường Đại học Giao thông Vận tải Hà Nội tiền thân là Trường Công chính Đông Dương, thành lập năm 1902 — một trong những cơ sở đào tạo kỹ thuật lâu đời ở Việt Nam.",
  "Bạn có biết: Chữ Quốc ngữ dùng chữ Latin hiện đại được hoàn thiện nhờ nhiều công sức, trong đó có Alexandre de Rhodes (thế kỷ XVII).",
  "Bạn có biết: Kinh thành Huế từng là kinh đô của triều Nguyễn (1802–1945), nằm dọc hai bên sông Hương.",
] as const;

const ROTATE_MS = 6500;

type LoadingPageProps = {
  className?: string;
  /** Hiển thị dòng “Bạn có biết” xoay vòng (mặc định bật). */
  showFacts?: boolean;
  /** Dòng phụ dưới tên app (ví dụ khi chờ redirect). */
  subtitle?: string;
};

const DEFAULT_SUBTITLE = "Đang khởi tạo phiên làm việc…";

export function LoadingPage({
  className,
  showFacts = true,
  subtitle = DEFAULT_SUBTITLE,
}: LoadingPageProps) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * FACTS.length));
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (!showFacts) return;
    const id = window.setInterval(() => {
      setFadeIn(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % FACTS.length);
        setFadeIn(true);
      }, 280);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [showFacts]);

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 px-6 text-slate-100",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div
          className="mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-lg shadow-indigo-500/10 backdrop-blur-md ring-1 ring-indigo-400/20 animation-duration-[2.8s]"
          aria-hidden
        >
          <GraduationCap className="h-10 w-10 text-indigo-300" strokeWidth={1.5} />
        </div>

        <h1 className="font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {APP_NAME}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{subtitle}</p>

        {showFacts && (
          <div className="mt-10 min-h-18 w-full max-w-lg">
            <p
              className={cn(
                "text-left text-sm leading-relaxed text-slate-300/90 transition-opacity duration-300",
                fadeIn ? "opacity-100" : "opacity-0",
              )}
            >
              
              {FACTS[index]}
            </p>
            <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
              {FACTS.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === index ? "w-6 bg-indigo-400" : "w-1.5 bg-white/20",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingPage;
