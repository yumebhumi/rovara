"use client";

import { cn } from "@/utils/cn";

type ProgressTrackerProps = {
  steps: Array<{ label: string }>;
  currentStep: number;
  completedSteps: boolean[];
};

export function ProgressTracker({ steps, currentStep, completedSteps }: ProgressTrackerProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="min-w-0 text-[0.9rem] text-[#94A3B8]">
          Step {currentStep + 1} of {steps.length}
          <span className="ml-2 text-[#F8FAF8]">{steps[currentStep]?.label}</span>
        </p>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.78rem] font-medium tracking-[0.01em] text-[#CBD5E1]">
          {Math.round(progress)}% ready
        </span>
      </div>

      <div className="space-y-3">
        <div
          className="h-px rounded-full bg-white/[0.08]"
          role="progressbar"
          aria-label="Trip form completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="h-px rounded-full bg-[linear-gradient(90deg,#14B8A6,rgba(143,227,207,0.92))] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:grid-cols-4">
          {steps.map((step, index) => {
            const active = index === currentStep;
            const complete = completedSteps[index];

            return (
              <li
                key={step.label}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "min-w-0 rounded-full border px-3 py-2 text-[0.82rem] transition-colors duration-300",
                  active
                    ? "border-[#14B8A6]/20 bg-[#14B8A6]/10 text-[#F8FAF8]"
                    : complete
                      ? "border-white/[0.08] bg-white/[0.04] text-[#D9F4EC]"
                      : "border-white/[0.06] bg-transparent text-[#64748B]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mr-2 inline-flex h-[1.35rem] w-[1.35rem] items-center justify-center rounded-full text-[0.72rem] font-medium transition-all duration-300",
                    active
                      ? "bg-[#14B8A6] text-[#041311]"
                      : complete
                        ? "bg-white/[0.08] text-[#F8FAF8]"
                        : "bg-white/[0.04] text-[#94A3B8]"
                  )}
                >
                  {index + 1}
                </span>
                <span className="align-middle">{step.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
