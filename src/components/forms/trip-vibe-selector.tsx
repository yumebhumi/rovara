"use client";

import { Coffee, Crown, Landmark, Leaf, Palmtree, Sparkles } from "lucide-react";
import { TRIP_VIBES, type TripVibe } from "@/lib/trip-vibes";
import { cn } from "@/utils/cn";

const vibeIcons: Record<TripVibe, typeof Sparkles> = {
  Relaxed: Palmtree,
  Adventure: Sparkles,
  Luxury: Crown,
  Cultural: Landmark,
  Nature: Leaf,
  "Food & Cafes": Coffee
};

type TripVibeSelectorProps = {
  value?: TripVibe[];
  onChange: (value: TripVibe[]) => void;
  disabled?: boolean;
  describedBy?: string;
  invalid?: boolean;
};

export function TripVibeSelector({
  value,
  onChange,
  disabled = false,
  describedBy,
  invalid = false
}: TripVibeSelectorProps) {
  const selectedVibes = value ?? [];

  function toggleVibe(option: TripVibe) {
    if (selectedVibes.includes(option)) {
      onChange(selectedVibes.filter((selected) => selected !== option));
      return;
    }

    onChange([...selectedVibes, option]);
  }

  return (
    <div
      role="group"
      aria-label="Travel vibe options"
      aria-describedby={describedBy}
      data-invalid={invalid ? "true" : undefined}
      className="flex flex-wrap gap-2.5"
    >
      {TRIP_VIBES.map((option) => {
        const active = selectedVibes.includes(option);
        const Icon = vibeIcons[option];

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => toggleVibe(option)}
            aria-pressed={active}
            className={cn(
              "group inline-flex min-h-11 items-center gap-2.5 rounded-full border px-4 py-2.5 text-left transition-[border-color,background-color,color,transform,box-shadow] duration-300",
              "hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/30 disabled:cursor-not-allowed disabled:opacity-60",
              active
                ? "border-[#14B8A6]/20 bg-[linear-gradient(180deg,rgba(20,184,166,0.14),rgba(20,184,166,0.06))] text-[#F8FAF8] shadow-[0_10px_26px_rgba(20,184,166,0.08)]"
                : "border-white/[0.08] bg-white/[0.025] text-[#CBD5E1] hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-[#F8FAF8]"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition",
                active ? "bg-[#14B8A6]/18 text-[#D6F5EC]" : "bg-white/[0.05] text-[#94A3B8]"
              )}
            >
              <Icon size={14} aria-hidden="true" />
            </span>
            <span className="text-[0.92rem] font-medium tracking-[-0.01em]">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
