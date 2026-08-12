// Hand-rolled line icons matching the app's established stroke style
// (viewBox 24x24, stroke=currentColor, strokeWidth 1.6, no fill). Keep new
// icons in this same style rather than pulling in an icon library — see
// design-system/foodrescue/MASTER.md.

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconPackage({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
      <path d="M3 7.5v9L12 21l9-4.5v-9" />
      <path d="M12 12v9" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconMapPin({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 21s7-6.8 7-12a7 7 0 1 0-14 0c0 5.2 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function IconTruck({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10h4l3 3.2v3.3h-7z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </svg>
  );
}

export function IconCheckCircle({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.3 12.2 11 15l4.7-6" />
    </svg>
  );
}

export function IconBuilding({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 21V5.5L12 3l8 2.5V21" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 9h.01M12 9h.01M15 9h.01M9 13h.01M12 13h.01M15 13h.01" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20.5c1.4-4 4.2-6 7.5-6s6.1 2 7.5 6" />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M2.8 19.5c1.2-3.4 3.4-5 6.2-5s5 1.6 6.2 5" />
      <path d="M15.5 5.6c1.3.4 2.2 1.6 2.2 3s-.9 2.6-2.2 3" />
      <path d="M17 14.7c1.9.6 3.3 2.1 4.2 4.8" />
    </svg>
  );
}

export function IconChartBar({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 21V10M11 21V3M18 21v-7" />
      <path d="M2.5 21h19" />
    </svg>
  );
}

export function IconShieldCheck({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3 5 5.7v5.4c0 4.6 3 7.7 7 9 4-1.3 7-4.4 7-9V5.7L12 3Z" />
      <path d="M8.7 12.1 11 14.4l4.3-5" />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m5 8 7 7 7-7" />
    </svg>
  );
}

export function IconInbox({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3.5 12h4.8l1.6 2.6h4.2L15.7 12h4.8" />
      <path d="M4.7 6.5h14.6L21 12v6a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-6l1.7-5.5Z" />
    </svg>
  );
}

export function IconSparkle({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3.5c.5 3 2 4.5 5 5-3 .5-4.5 2-5 5-.5-3-2-4.5-5-5 3-.5 4.5-2 5-5Z" />
      <path d="M19 14.5c.25 1.4.95 2.1 2.35 2.35-1.4.25-2.1.95-2.35 2.35-.25-1.4-.95-2.1-2.35-2.35 1.4-.25 2.1-.95 2.35-2.35Z" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

export function IconLeaf({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M5 19c-1.2-6.6 2.4-13 12.5-14.5C19 13.6 13 18.4 5 19Z" />
      <path d="M6 18c3-3.4 6-6.4 10.8-12.6" />
    </svg>
  );
}

export function IconHandHeart({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 14.5c2.5-3 5-3.6 8-2.3l4.3 1.6c1 .4 1 1.8-.1 2.1l-5.4 1.5-4.3-1" />
      <path d="M3 13.5v6" />
      <path d="M12.5 9c-1-1-1-2.4 0-3.2.9-.8 2.1-.6 2.7.2.6-.8 1.8-1 2.7-.2 1 .8 1 2.2 0 3.2l-2.7 2.6-2.7-2.6Z" />
    </svg>
  );
}

export function IconBike({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="5.5" cy="17.5" r="3.2" />
      <circle cx="18.5" cy="17.5" r="3.2" />
      <path d="M5.5 17.5 9.5 9h5l4 8.5" />
      <path d="M9.5 9 8 6.5H6" />
      <path d="M9.5 9l3 5.5h4" />
    </svg>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function IconEye({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
