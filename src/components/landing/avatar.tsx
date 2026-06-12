"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";

type AvatarProps = {
  name: string;
  src?: string;
  className?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

export function Avatar({ name, src, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-[#F4EDE1]/28",
        "bg-[linear-gradient(140deg,rgba(244,237,225,0.14),rgba(47,111,115,0.14))]",
        "shadow-[0_0_18px_rgba(47,111,115,0.16)]",
        className
      )}
      aria-label={name}
    >
      {src ? (
        <Image src={src} alt={name} width={40} height={40} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-semibold tracking-wider text-[#F4EDE1]">{initials(name)}</span>
      )}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#2F6F73]/20" />
    </div>
  );
}
