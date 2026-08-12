export const THEME_STORAGE_KEY = "fr-theme";

export const THEMES = [
  { id: "harvest", label: "Harvest", hint: "Light & fresh", swatch: "#2f6b45" },
  { id: "midnight", label: "Midnight", hint: "Dark mode", swatch: "#6fa84a" },
  { id: "terroir", label: "Terroir", hint: "Warm & rich", swatch: "#3f6b3a" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "harvest";
