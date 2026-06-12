"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Route } from "lucide-react";
import { pageTransition } from "@/styles/animations";
import { cn } from "@/utils/cn";

export type MapPoint = {
  lat: number;
  lng: number;
  label: string;
  category?: string;
};

type MapVariant = "embedded" | "mini" | "route";

type MapboxMapProps = {
  points: MapPoint[];
  heightClassName?: string;
  className?: string;
  showRoute?: boolean;
  overlayLabel?: string;
  controls?: boolean;
  interactive?: boolean;
  fallbackVariant?: "default" | "mini";
  variant?: MapVariant;
};

const MapboxRenderer = dynamic(
  () => import("./mapbox-renderer").then((mod) => mod.MapboxRenderer),
  {
    ssr: false,
    loading: () => <MapFallback heightClassName="h-full" variant="mini" />
  }
);

function MapFallback({
  heightClassName,
  className,
  label = "Route preview",
  variant = "embedded"
}: {
  heightClassName?: string;
  className?: string;
  label?: string;
  variant?: MapVariant | "default";
}) {
  const compact = variant === "mini";

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-white/[0.08] bg-[#071314] text-[#F8FAF8]",
        compact ? "rounded-[1rem]" : "rounded-[1.35rem]",
        heightClassName,
        className
      )}
      aria-label={label}
      role="img"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(143,227,207,0.14),transparent_26%),linear-gradient(rgba(248,250,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,248,0.035)_1px,transparent_1px)] bg-[size:100%_100%,28px_28px,28px_28px] opacity-80"
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-[14%] right-[16%] top-1/2 h-px -translate-y-1/2 bg-[#8FE3CF]/45 shadow-[0_0_14px_rgba(143,227,207,0.28)]"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={pageTransition}
      />
      <span aria-hidden="true" className="absolute left-[18%] top-[39%] h-2.5 w-2.5 rounded-full border border-[#071314] bg-[#8FE3CF] shadow-[0_0_12px_rgba(143,227,207,0.42)]" />
      <span aria-hidden="true" className="absolute right-[24%] top-[54%] h-2.5 w-2.5 rounded-full border border-[#071314] bg-[#14B8A6] shadow-[0_0_12px_rgba(20,184,166,0.34)]" />
      <div className="absolute inset-x-3 bottom-3 truncate rounded-full border border-white/[0.08] bg-[#0B1215]/64 px-3 py-1.5 text-[10px] font-medium text-[#F8FAF8]/72 backdrop-blur-md">
        {label}
      </div>
    </div>
  );
}

export function MapboxMap({
  points,
  heightClassName = "h-[260px]",
  className,
  showRoute = false,
  overlayLabel,
  controls = false,
  interactive = true,
  fallbackVariant,
  variant = "embedded"
}: MapboxMapProps) {
  const tokenReady = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  const fallbackLabel = overlayLabel ?? points[0]?.label ?? "Route preview";

  if (!tokenReady) {
    return (
      <MapFallback
        heightClassName={heightClassName}
        className={className}
        label={fallbackLabel}
        variant={fallbackVariant === "mini" ? "mini" : variant}
      />
    );
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden border border-white/[0.08] bg-[#071314]/80 shadow-[0_18px_52px_rgba(0,0,0,0.22)]",
        variant === "mini" ? "rounded-[1rem]" : "rounded-[1.35rem]",
        heightClassName,
        className
      )}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={pageTransition}
    >
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(180deg,rgba(11,18,21,0.08),rgba(11,18,21,0.28))]" />
      <MapboxRenderer
        points={points}
        showRoute={showRoute}
        overlayLabel={overlayLabel}
        controls={controls}
        interactive={interactive}
        variant={variant}
      />
    </motion.div>
  );
}

export function DestinationMarker({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-[#F8FAF8]/78">
      <MapPin size={13} className="text-[#8FE3CF]" aria-hidden="true" />
      {label}
    </span>
  );
}

export function EmbeddedMap({
  points,
  label,
  className
}: {
  points: MapPoint[];
  label?: string;
  className?: string;
}) {
  return (
    <MapboxMap
      points={points}
      heightClassName="h-[190px] sm:h-[220px]"
      className={className}
      overlayLabel={label}
      controls
      showRoute={points.length > 1}
      variant="embedded"
    />
  );
}

export function MiniMapCard({
  points,
  label,
  className
}: {
  points: MapPoint[];
  label?: string;
  className?: string;
}) {
  return (
    <MapboxMap
      points={points}
      heightClassName="h-28 sm:h-32"
      className={className}
      overlayLabel={label}
      controls={false}
      interactive={false}
      showRoute={points.length > 1}
      fallbackVariant="mini"
      variant="mini"
    />
  );
}

export function RoutePreview({
  points,
  label,
  className
}: {
  points: MapPoint[];
  label?: string;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl", className)} aria-label={label ?? "Route preview"}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8FE3CF]">Route context</p>
          <h3 className="mt-1 text-base font-semibold text-[#F8FAF8]">{label ?? "Subtle route preview"}</h3>
        </div>
        <Route size={18} className="text-[#8FE3CF]" aria-hidden="true" />
      </div>
      <MapboxMap
        points={points}
        heightClassName="h-[210px] sm:h-[250px]"
        overlayLabel={points.length > 1 ? `${points.length} stops` : points[0]?.label}
        showRoute={points.length > 1}
        controls={false}
        variant="route"
      />
    </section>
  );
}

export function TimelineMapPreview({
  points,
  label
}: {
  points: MapPoint[];
  label: string;
}) {
  if (!points.length) return null;

  return (
    <div className="mt-5">
      <MiniMapCard points={points.slice(0, 3)} label={label} />
    </div>
  );
}
