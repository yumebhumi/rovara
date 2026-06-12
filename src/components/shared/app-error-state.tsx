"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Compass, RotateCcw } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

type AppErrorStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function AppErrorState({
  eyebrow = "Something interrupted the journey",
  title,
  description,
  retryLabel = "Try again",
  onRetry,
  primaryHref = ROUTES.TRIPS,
  primaryLabel = "Back to Trips",
  secondaryHref = ROUTES.GENERATE,
  secondaryLabel = "Start Planning"
}: AppErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-[70svh] w-full max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="relative w-full overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#10191D]/78 px-5 py-12 text-center shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:rounded-[2rem] sm:px-10 sm:py-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(143,227,207,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_42%)]"
        />
        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#14B8A6]/18 bg-[#14B8A6]/10 text-[#8FE3CF]">
            <AlertTriangle size={28} aria-hidden="true" />
          </div>

          <p className="rovara-eyebrow mt-8">{eyebrow}</p>
          <h1 className="rovara-section-title mt-5">{title}</h1>
          <p className="rovara-body mx-auto mt-5 max-w-xl">{description}</p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
            {onRetry ? (
              <Button type="button" onClick={onRetry} className="h-11 rounded-full px-5">
                <RotateCcw size={15} aria-hidden="true" />
                {retryLabel}
              </Button>
            ) : null}

            <Link href={primaryHref} className="w-full sm:w-auto">
              <Button variant={onRetry ? "outline" : "default"} className="h-11 w-full rounded-full px-5 sm:w-auto">
                <ArrowLeft size={15} aria-hidden="true" />
                {primaryLabel}
              </Button>
            </Link>

            <Link href={secondaryHref} className="w-full sm:w-auto">
              <Button variant="outline" className="h-11 w-full rounded-full px-5 sm:w-auto">
                <Compass size={15} aria-hidden="true" />
                {secondaryLabel}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
