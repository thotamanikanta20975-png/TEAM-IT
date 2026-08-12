"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { THEME_CHANGE_EVENT } from "@/components/ThemeToggle";

type Pin = {
  lat: number;
  lng: number;
  label: string;
  color: string;
};

type DonationMapProps = {
  pins: Pin[];
};

const WARM_ROUTE_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#faf5ec" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b6259" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#f3ebda" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e4dac7" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe0d1" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f6f0e2" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#e4dac7" }] },
];

// Google Maps styles can't read CSS custom properties, so the Midnight
// theme needs its own literal-hex variant — kept in sync by eye with
// [data-theme="midnight"] in globals.css.
const DARK_ROUTE_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1b1f14" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#14170f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a9a08c" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#242a1a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2c3220" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#16241a" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#181c12" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2c3220" }] },
];

function currentMapStyle() {
  return document.documentElement.getAttribute("data-theme") === "midnight"
    ? DARK_ROUTE_MAP_STYLE
    : WARM_ROUTE_MAP_STYLE;
}

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function DonationMap({ pins }: DonationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "no-key" | "error">(
    MAPS_API_KEY ? "loading" : "no-key"
  );

  useEffect(() => {
    function onThemeChange() {
      mapRef.current?.setOptions({ styles: currentMapStyle() });
    }
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
  }, []);

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
          styles: currentMapStyle(),
          disableDefaultUI: true,
          zoomControl: true,
        });
        mapRef.current = map;
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
              strokeColor: "#faf5ec",
              strokeWeight: 2,
            },
          });
        });

        if (pins.length > 1) {
          new google.maps.Polyline({
            path: pins.map((p) => ({ lat: p.lat, lng: p.lng })),
            map,
            strokeColor: "#d9a441",
            strokeOpacity: 0.7,
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
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 text-center text-sm text-text-dim">
        Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to see this on a live map.
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-border bg-surface px-6 text-center text-sm text-text-dim">
        No location on file yet.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-border bg-surface px-6 text-center text-sm text-danger">
        Couldn&rsquo;t load the map.
      </div>
    );
  }

  return (
    <div className="relative h-56 overflow-hidden rounded-2xl border border-border">
      <div ref={containerRef} className="h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface text-sm text-text-dim">
          Loading map…
        </div>
      )}
    </div>
  );
}
