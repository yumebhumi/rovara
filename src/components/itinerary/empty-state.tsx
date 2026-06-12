import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

type ItineraryEmptyStateProps = {
  title?: string;
  description?: string;
};

export function ItineraryEmptyState({
  title = "This journey has no rendered itinerary yet.",
  description = "Generate or regenerate the trip to unlock the cinematic day-by-day itinerary experience."
}: ItineraryEmptyStateProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#10191D]/74 px-6 py-16 text-center shadow-[0_24px_64px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(20,184,166,0.16),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(143,227,207,0.08),transparent_18%)]"
      />
      <div className="relative mx-auto max-w-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#14B8A6]/18 bg-[#14B8A6]/10 text-[#8FE3CF]">
          <Compass size={28} aria-hidden="true" />
        </div>
        <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8FE3CF]">
          <Sparkles size={12} aria-hidden="true" />
          Journey Pending
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#F8FAF8] sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#94A3B8]">
          {description}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href={ROUTES.GENERATE}>
            <Button>Generate Trip</Button>
          </Link>
          <Link href={ROUTES.TRIPS}>
            <Button variant="outline">Browse Saved Trips</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
