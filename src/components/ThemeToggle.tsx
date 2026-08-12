"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES, type ThemeId } from "@/lib/theme";
import { IconCheckCircle, IconSparkle } from "@/components/icons";

export const THEME_CHANGE_EVENT = "fr-themechange";

function applyTheme(id: ThemeId) {
  if (id === DEFAULT_THEME) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", id);
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // Storage can be unavailable (private browsing, disabled) — the
    // in-memory theme still applies for this page view.
  }
  // Lets non-CSS-var consumers (e.g. the Google Maps style array, which
  // can't read CSS custom properties) react to a live theme switch.
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: id }));
}

function subscribeToThemeChange(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

function getThemeSnapshot(): ThemeId {
  const current = document.documentElement.getAttribute("data-theme") as ThemeId | null;
  return current && THEMES.some((t) => t.id === current) ? current : DEFAULT_THEME;
}

function getServerThemeSnapshot(): ThemeId {
  return DEFAULT_THEME;
}

export function ThemeToggle() {
  // useSyncExternalStore (not useState+effect) is the hydration-safe way to
  // read state owned outside React — the pre-hydration script in layout.tsx
  // may have already set data-theme by the time this mounts, and this hook
  // reconciles that without a setState-in-effect render cascade or a
  // server/client text mismatch.
  const theme = useSyncExternalStore(subscribeToThemeChange, getThemeSnapshot, getServerThemeSnapshot);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function select(id: ThemeId) {
    applyTheme(id);
    setOpen(false);
  }

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:border-accent"
      >
        <span
          className="h-3 w-3 flex-none rounded-full border border-black/10"
          style={{ background: active.swatch }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{active.label}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-56 rounded-2xl border border-border bg-surface p-1.5 shadow-[0_8px_24px_rgba(38,34,30,0.12)]"
        >
          <div className="flex items-center gap-1.5 px-2.5 pt-1.5 pb-2 text-[0.68rem] font-mono tracking-wide text-text-dim uppercase">
            <IconSparkle className="h-3 w-3" /> Theme
          </div>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="menuitemradio"
              aria-checked={t.id === theme}
              onClick={() => select(t.id)}
              className="flex w-full items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-2 text-left text-sm transition-colors hover:bg-surface-2"
            >
              <span
                className="h-4 w-4 flex-none rounded-full border border-black/10"
                style={{ background: t.swatch }}
                aria-hidden="true"
              />
              <span className="flex-1">
                <span className="block font-medium text-text">{t.label}</span>
                <span className="block text-xs text-text-dim">{t.hint}</span>
              </span>
              {t.id === theme && <IconCheckCircle className="h-4 w-4 flex-none text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
