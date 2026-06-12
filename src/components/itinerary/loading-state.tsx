import { cn } from "@/utils/cn";

function SkeletonBlock({
  className
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[1.2rem] bg-[linear-gradient(90deg,rgba(255,255,255,0.05),rgba(143,227,207,0.09),rgba(255,255,255,0.05))] bg-[length:220%_100%]",
        className
      )}
    />
  );
}

export function ItineraryLoadingState() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 sm:space-y-12">
      <section className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#10191D] sm:rounded-[2rem]">
        <SkeletonBlock className="h-[18rem] w-full rounded-none sm:h-[24rem] lg:h-[30rem]" />
        <div className="space-y-5 px-5 py-7 sm:px-10 sm:py-10">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-12 w-full max-w-2xl sm:h-14 sm:w-2/3" />
          <SkeletonBlock className="h-5 w-full max-w-3xl" />
          <SkeletonBlock className="h-5 w-4/5 max-w-2xl" />
          <div className="grid gap-4 pt-3 sm:grid-cols-3">
            <SkeletonBlock className="h-24 w-full" />
            <SkeletonBlock className="h-24 w-full" />
            <SkeletonBlock className="h-24 w-full" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SkeletonBlock className="mx-auto h-4 w-32" />
        <SkeletonBlock className="mx-auto h-10 w-80 max-w-full" />
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-5 sm:rounded-[1.8rem] sm:p-6"
            >
              <div className="grid min-w-0 gap-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
                <div className="space-y-3">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-8 w-40" />
                  <SkeletonBlock className="h-16 w-full" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((__, blockIndex) => (
                    <SkeletonBlock
                      key={blockIndex}
                      className="h-32 w-full rounded-[1.4rem]"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
