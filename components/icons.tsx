// Lucide-style inline SVG icons — consistent 24×24, 1.75 stroke, round caps.
// Replaces emoji (per ui-ux-pro-max: no-emoji-icons is CRITICAL).

type IconProps = { className?: string };
const base = (className?: string) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export const IconLayers = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </svg>
);

export const IconPresentation = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M2 3h20" />
    <path d="M3 3v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3" />
    <path d="m12 16-3 5" />
    <path d="m12 16 3 5" />
    <path d="M9 9.5 11 11l3-3.5" />
  </svg>
);

export const IconBookmark = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
  </svg>
);

export const IconMail = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const IconRepeat = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

export const IconPalette = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="13.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="10.5" r=".75" fill="currentColor" stroke="none" />
    <circle cx="8.5" cy="7.5" r=".75" fill="currentColor" stroke="none" />
    <circle cx="6.5" cy="12.5" r=".75" fill="currentColor" stroke="none" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2Z" />
  </svg>
);

export const IconSearch = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconPlus = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const IconX = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const IconSun = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const IconMoon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const IconArrowRight = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const IconArrowUpRight = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

export const IconImage = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export const IconTrash = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const IconUpload = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

export const IconDownload = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
);

export const IconExternalLink = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

export const IconMaximize = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

export const IconChevronDown = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconStar = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <svg {...base(className)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 2.5Z" />
  </svg>
);

export const IconSparkles = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
    <path d="M19 14l.7 1.9L21.5 16.6l-1.8.7L19 19l-.7-1.7-1.8-.7 1.8-.7z" />
    <path d="M5 14l.6 1.6L7 16.2l-1.4.6L5 18l-.6-1.2L3 16.2l1.4-.6z" />
  </svg>
);

export const IconCopy = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect width="13" height="13" x="9" y="9" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconCheck = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconTool = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
  </svg>
);
