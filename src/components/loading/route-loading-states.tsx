import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[1rem] bg-[linear-gradient(90deg,rgba(255,255,255,0.045),rgba(143,227,207,0.085),rgba(255,255,255,0.045))] bg-[length:220%_100%]",
        className
      )}
    />
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {children}
    </main>
  );
}

export function RootLoadingState() {
  return (
    <Shell>
      <div className="space-y-10">
        <section className="overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#10191D]/78 p-5 backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="mt-6 h-12 w-full max-w-2xl sm:h-16" />
          <SkeletonBlock className="mt-5 h-5 w-full max-w-3xl" />
          <SkeletonBlock className="mt-3 h-5 w-4/5 max-w-2xl" />
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-36 w-full rounded-[1.25rem]" />
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function GenerateTripLoadingState() {
  return (
    <section className="grid min-w-0 gap-10 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
      <div className="min-w-0 space-y-8">
        <div className="max-w-2xl space-y-4">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-14 w-full max-w-xl sm:h-20" />
          <SkeletonBlock className="h-5 w-full max-w-lg" />
          <SkeletonBlock className="h-5 w-4/5 max-w-md" />
        </div>

        <div className="w-full max-w-[42rem] space-y-5">
          <SkeletonBlock className="h-20 w-full rounded-[1.4rem]" />
          <div className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-5 h-10 w-3/4" />
            <SkeletonBlock className="mt-4 h-5 w-full" />
            <SkeletonBlock className="mt-8 h-20 w-full rounded-[1.2rem]" />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <SkeletonBlock className="h-11 w-full sm:w-28" />
              <SkeletonBlock className="h-11 w-full sm:w-32" />
            </div>
          </div>
        </div>
      </div>

      <aside className="min-w-0 xl:sticky xl:top-28">
        <div className="overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#10191D]/78 backdrop-blur-xl sm:rounded-[2rem]">
          <div className="border-b border-white/[0.06] p-5 sm:p-6">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-4 h-10 w-full" />
            <SkeletonBlock className="mt-4 h-4 w-5/6" />
          </div>
          <div className="space-y-4 p-4 sm:p-6">
            <SkeletonBlock className="h-56 w-full rounded-[1.35rem]" />
            <SkeletonBlock className="h-16 w-full rounded-[1.1rem]" />
            <SkeletonBlock className="h-16 w-full rounded-[1.1rem]" />
            <SkeletonBlock className="h-16 w-full rounded-[1.1rem]" />
          </div>
        </div>
      </aside>
    </section>
  );
}

export function SavedTripsLoadingState() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 sm:space-y-16">
      <section className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#10191D]/70 px-5 py-12 backdrop-blur-xl sm:rounded-[2rem] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="mt-6 h-14 w-full max-w-xl sm:h-20" />
        <SkeletonBlock className="mt-7 h-5 w-full max-w-2xl" />
        <SkeletonBlock className="mt-3 h-5 w-4/5 max-w-xl" />
        <div className="mt-10 flex flex-wrap gap-3">
          <SkeletonBlock className="h-8 w-24 rounded-full" />
          <SkeletonBlock className="h-8 w-36 rounded-full" />
          <SkeletonBlock className="h-8 w-44 rounded-full" />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading saved trips">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_22px_62px_rgba(0,0,0,0.2)] sm:rounded-[1.55rem]"
          >
            <SkeletonBlock className="h-48 w-full rounded-[1.2rem]" />
            <SkeletonBlock className="mt-5 h-8 w-2/3" />
            <SkeletonBlock className="mt-3 h-4 w-1/2" />
            <div className="mt-6 grid gap-3 min-[430px]:grid-cols-3">
              <SkeletonBlock className="h-20 rounded-[1rem]" />
              <SkeletonBlock className="h-20 rounded-[1rem]" />
              <SkeletonBlock className="h-20 rounded-[1rem]" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
