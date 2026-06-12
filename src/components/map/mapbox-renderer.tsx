"use client";

import Map, { Layer, Marker, NavigationControl, Popup, Source } from "react-map-gl/mapbox";
import { useMemo, useState } from "react";
import { apiConfig } from "@/config/api";
import type { MapPoint } from "./mapbox-map";

type MapboxRendererProps = {
  points: MapPoint[];
  showRoute?: boolean;
  overlayLabel?: string;
  controls?: boolean;
  interactive?: boolean;
  zoom?: number;
  variant?: "embedded" | "mini" | "route";
};

const routePaint = {
  "line-color": "#8FE3CF",
  "line-opacity": 0.48,
  "line-width": 2,
  "line-blur": 0.8
} as const;

const routeGlowPaint = {
  "line-color": "#14B8A6",
  "line-opacity": 0.18,
  "line-width": 7,
  "line-blur": 4
} as const;

function markerClassName(variant: MapboxRendererProps["variant"]) {
  if (variant === "mini") {
    return "h-2.5 w-2.5 rounded-full border border-[#0B1215] bg-[#8FE3CF] shadow-[0_0_8px_rgba(143,227,207,0.28)] transition-opacity duration-200 hover:opacity-90";
  }

  return "h-3 w-3 rounded-full border border-[#0B1215] bg-[#8FE3CF] shadow-[0_0_10px_rgba(143,227,207,0.26)] transition-opacity duration-200 hover:opacity-90";
}

export function MapboxRenderer({
  points,
  showRoute = false,
  overlayLabel,
  controls = false,
  interactive = true,
  zoom,
  variant = "embedded"
}: MapboxRendererProps) {
  const [popup, setPopup] = useState<MapPoint | null>(null);
  const firstPoint = points[0];
  const coordinates = points.map((point) => [point.lng, point.lat]);
  const lineData = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates
      }
    }),
    [coordinates]
  );

  return (
    <>
      {overlayLabel ? (
        <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-white/[0.08] bg-[#0B1215]/62 px-3 py-1 text-[10px] font-medium tracking-[0.12em] text-[#F8FAF8]/76 backdrop-blur-xl">
          {overlayLabel}
        </div>
      ) : null}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          latitude: firstPoint?.lat ?? 35.6764,
          longitude: firstPoint?.lng ?? 139.65,
          zoom: zoom ?? (variant === "mini" ? 12.2 : 10.8),
          pitch: variant === "mini" ? 0 : 18
        }}
        mapStyle={apiConfig.mapbox.style}
        attributionControl={false}
        dragPan={interactive}
        dragRotate={false}
        scrollZoom={interactive}
        touchZoomRotate={interactive}
        doubleClickZoom={interactive}
        keyboard={interactive}
      >
        {controls ? <NavigationControl position="bottom-right" showCompass={false} visualizePitch={false} /> : null}
        {showRoute && points.length > 1 ? (
          <Source id="route-line" type="geojson" data={lineData}>
            <Layer id="route-line-glow" type="line" paint={routeGlowPaint} />
            <Layer id="route-line-core" type="line" paint={routePaint} />
          </Source>
        ) : null}
        {points.map((point) => (
          <Marker
            key={`${point.label}-${point.lat}-${point.lng}`}
            latitude={point.lat}
            longitude={point.lng}
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setPopup(point);
            }}
          >
            <button type="button" className={markerClassName(variant)} aria-label={point.label} />
          </Marker>
        ))}
        {popup ? (
          <Popup
            latitude={popup.lat}
            longitude={popup.lng}
            onClose={() => setPopup(null)}
            closeButton={false}
            offset={12}
            className="rovara-map-popup"
          >
            <div className="px-1 py-0.5 text-xs font-medium text-[#0B1215]">{popup.label}</div>
          </Popup>
        ) : null}
      </Map>
    </>
  );
}
