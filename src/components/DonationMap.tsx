"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

type Pin = {
  lat: number;
  lng: number;
  label: string;
  color: string;
};

type DonationMapProps = {
  pins: Pin[];
};

const NIGHT_ROUTE_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#171d27" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#10141b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8c97a8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f2733" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#12161f" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a3444" }] },
];

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function DonationMap({ pins }: DonationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "no-key" | "error">(
    MAPS_API_KEY ? "loading" : "no-key"
  );

  useEffect(() => {
    if (!MAPS_API_KEY) return;
    if (pins.length === 0) return;

    setOptions({ key: MAPS_API_KEY, v: "weekly" });

    let cancelled = false;

    importLibrary("maps")
      .then(({ Map }) => {
        if (cancelled || !containerRef.current) return;

        const bounds = new google.maps.LatLngBounds();
        pins.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));

        const map = new Map(containerRef.current, {
          styles: NIGHT_ROUTE_MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
        });
        map.fitBounds(bounds, 48);

        pins.forEach((p) => {
          new google.maps.Marker({
            position: { lat: p.lat, lng: p.lng },
            map,
            title: p.label,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: p.color,
              fillOpacity: 1,
              strokeColor: "#10141b",
              strokeWeight: 2,
            },
          });
        });

        if (pins.length > 1) {
          new google.maps.Polyline({
            path: pins.map((p) => ({ lat: p.lat, lng: p.lng })),
            map,
            strokeColor: "#4c8dff",
            strokeOpacity: 0.6,
            strokeWeight: 2,
          });
        }

        setStatus("ready");
      })
      .catch(() => setStatus("error"));

    return () => {
      cancelled = true;
    };
  }, [pins]);

  if (status === "no-key") {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 text-center text-sm text-text-dim">
        Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to see this on a live map.
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-border bg-surface px-6 text-center text-sm text-text-dim">
        No location on file yet.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-border bg-surface px-6 text-center text-sm text-accent-3">
        Couldn&rsquo;t load the map.
      </div>
    );
  }

  return (
    <div className="relative h-56 overflow-hidden rounded-lg border border-border">
      <div ref={containerRef} className="h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface text-sm text-text-dim">
          Loading map…
        </div>
      )}
    </div>
  );
}
