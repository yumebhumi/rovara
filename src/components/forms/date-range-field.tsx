"use client";

import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

type DateRangeFieldProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStartDateBlur: () => void;
  onEndDateBlur: () => void;
  disabled?: boolean;
  startError?: boolean;
  endError?: boolean;
  describedBy?: string;
};

type DateInputCardProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  error?: boolean;
  min?: string;
  describedBy?: string;
};

function DateInputCard({
  id,
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  error = false,
  min,
  describedBy
}: DateInputCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.3rem] border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 transition-all duration-300 focus-within:border-[#14B8A6]/22 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_0_1px_rgba(20,184,166,0.08),0_16px_36px_rgba(0,0,0,0.1)] light:border-[#0F1720]/8 light:bg-white",
        error && "border-red-300/40 focus-within:border-red-300/50"
      )}
    >
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.82rem] font-medium tracking-[0.01em] text-[#94A3B8] light:text-[#64748B]"
      >
        {label}
      </label>
      <Input
        id={id}
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={error}
        aria-describedby={describedBy}
        className="h-10 rounded-2xl border-0 bg-transparent px-0 py-0 text-[0.98rem] text-[#F8FAF8] focus-visible:ring-0 light:text-[#0F1720]"
      />
    </div>
  );
}

export function DateRangeField({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onStartDateBlur,
  onEndDateBlur,
  disabled = false,
  startError = false,
  endError = false,
  describedBy
}: DateRangeFieldProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="relative">
        <CalendarDays size={14} aria-hidden="true" className="pointer-events-none absolute right-4 top-4 z-10 text-[#64748B]" />
        <DateInputCard
          id="startDate"
          label="Departure"
          value={startDate}
          onChange={onStartDateChange}
          onBlur={onStartDateBlur}
          disabled={disabled}
          error={startError}
          describedBy={describedBy}
        />
      </div>
      <div className="relative">
        <CalendarDays size={14} aria-hidden="true" className="pointer-events-none absolute right-4 top-4 z-10 text-[#64748B]" />
        <DateInputCard
          id="endDate"
          label="Return"
          value={endDate}
          min={startDate || undefined}
          onChange={onEndDateChange}
          onBlur={onEndDateBlur}
          disabled={disabled}
          error={endError}
          describedBy={describedBy}
        />
      </div>
    </div>
  );
}
