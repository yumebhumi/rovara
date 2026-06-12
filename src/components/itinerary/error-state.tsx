"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

type ItineraryErrorStateProps = {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ItineraryErrorState({
  title,
  description,
  retryLabel = "Retry",
  onRetry
}: ItineraryErrorStateProps) {
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/[0.08] bg-white/[0.035] px-6 py-14 text-center shadow-[0_24px_64px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#14B8A6]/18 bg-[#14B8A6]/10 text-[#8FE3CF]">
        <AlertTriangle size={28} aria-hidden="true" />
      </div>
      <h1 className="mt-7 text-3xl font-semibold tracking-[-0.04em] text-[#F8FAF8]">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#94A3B8]">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button onClick={onRetry} className="gap-2">
            <RotateCcw size={14} />
            {retryLabel}
          </Button>
        ) : null}
        <Link href={ROUTES.TRIPS}>
          <Button variant="outline">Back to Trips</Button>
        </Link>
      </div>
    </section>
  );
}
