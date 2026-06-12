"use client";

import { MapPinned, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

type DestinationInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  error?: boolean;
  describedBy?: string;
  invalid?: boolean;
};

export function DestinationInput({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  error = false,
  describedBy,
  invalid = false
}: DestinationInputProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-white/[0.025] backdrop-blur-lg transition-all duration-300 focus-within:border-[#14B8A6]/22 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_0_1px_rgba(20,184,166,0.08),0_16px_36px_rgba(0,0,0,0.1)] light:border-[#0F1720]/8 light:bg-white",
        error && "border-red-300/40 focus-within:border-red-300/50"
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[radial-gradient(circle_at_left,rgba(20,184,166,0.09),transparent_68%)]" />
      <div className="relative flex min-h-[4.45rem] items-center gap-3.5 px-[1.125rem]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-white/[0.08] bg-white/[0.04] text-[#D6F5EC]">
          <MapPinned size={16} aria-hidden="true" />
        </span>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="Where would you like to go?"
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="h-auto flex-1 border-0 bg-transparent py-0 pl-0 text-[0.98rem] leading-none text-[#F8FAF8] placeholder:text-[#94A3B8] shadow-none focus:border-0 focus:bg-transparent focus:ring-0 focus-visible:ring-0 light:text-[#0F1720] light:placeholder:text-[#64748B]"
        />
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[0.72rem] font-medium tracking-[0.01em] text-[#94A3B8] xl:inline-flex light:border-[#0F1720]/8 light:bg-white light:text-[#64748B]">
          <Sparkles size={11} className="text-[#8FE3CF]" aria-hidden="true" />
          AI-ready
        </span>
      </div>
    </div>
  );
}
