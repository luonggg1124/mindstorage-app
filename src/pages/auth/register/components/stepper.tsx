type StepperProps = {
  current: number; // 0-based
  steps: string[];
};

export function Stepper({ current, steps }: StepperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {steps.map((label, index) => {
          const state =
            index === current ? "current" : index < current ? "done" : "todo";

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                  state === "done"
                    ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-200"
                    : state === "current"
                      ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100"
                      : "border-slate-700 bg-slate-900 text-slate-300",
                ].join(" ")}
              >
                {index + 1}
              </div>
              <div className="text-xs text-slate-300">{label}</div>
              {index < steps.length - 1 && (
                <div className="h-px w-6 bg-slate-800" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

