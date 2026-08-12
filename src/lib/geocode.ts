import "server-only";

// Free geocoding via OpenStreetMap's Nominatim — no API key, no billing
// account. Google's Geocoding API is deliberately not used here so the only
// Google Maps usage in the app is the free-tier Maps JavaScript API for
// display. Nominatim's usage policy caps requests at 1/sec and requires an
// identifying User-Agent, which is more than enough for a hackathon demo's
// occasional address lookups (a handful per signup/donation, not bulk).
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const trimmed = address.trim();
  if (!trimmed) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FoodRescue-Hackathon-Demo/1.0 (contact: app admin)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;

    const results: Array<{ lat: string; lon: string }> = await res.json();
    const first = results[0];
    if (!first) return null;

    return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
  } catch {
    return null;
  }
}
