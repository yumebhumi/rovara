"use client";

import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export function Rating({ value, className }: { value: number; className?: string }) {
  const stars = Array.from({ length: 5 }).map((_, i) => i < value);
  return (
    <div className={cn("inline-flex items-center gap-1", className)} aria-label={`${value} out of 5 stars`}>
      {stars.map((filled, i) => (
        <Star
          key={i}
          size={14}
          className={cn(
            "transition-colors",
            filled ? "fill-[#2F6F73] text-[#2F6F73]" : "text-[#F4EDE1]/30"
          )}
        />
      ))}
    </div>
  );
}

