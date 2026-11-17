import type { ReactNode, SVGProps } from "react";

/**
 * Satu keluarga ikon garis: viewBox 24, stroke 1.8, ujung bulat.
 * Ikon dekoratif (aria-hidden). Tombol selalu punya teks, ikon tidak berdiri sendiri.
 */
function make(path: ReactNode, displayName: string) {
  const Icon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {path}
    </svg>
  );
  Icon.displayName = displayName;
  return Icon;
}

export const IconHome = make(<path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />, "IconHome");

export const IconOrder = make(
  <>
    <path d="M7 4h10a1 1 0 0 1 1 1v15l-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1z" />
    <path d="M9.5 9h5M9.5 13h3" />
  </>,
  "IconOrder",
);

export const IconPartnership = make(
  <>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <circle cx="17" cy="9.5" r="2.4" />
    <path d="M16 14.2a4.6 4.6 0 0 1 4.5 4.8" />
  </>,
  "IconPartnership",
);

export const IconTrace = make(
  <>
    <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
    <path d="M8.5 8.5h2.5v2.5H8.5zM13 8.5h2.5v2.5H13zM8.5 13h2.5v2.5H8.5zM13 14.25h2.5M14.25 13v2.5" />
  </>,
  "IconTrace",
);

export const IconSearch = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </>,
  "IconSearch",
);

export const IconSun = make(
  <>
    <circle cx="12" cy="12" r="3.8" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </>,
  "IconSun",
);

export const IconMoon = make(<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />, "IconMoon");

export const IconCheck = make(<path d="m5 12.5 4.5 4.5L19 7.5" />, "IconCheck");

export const IconClose = make(<path d="M6 6l12 12M18 6 6 18" />, "IconClose");

export const IconAlert = make(
  <>
    <path d="M12 4 3 19.5h18z" />
    <path d="M12 10v4.5M12 17.2v.1" />
  </>,
  "IconAlert",
);

export const IconInfo = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8.2v.1" />
  </>,
  "IconInfo",
);

export const IconChevronRight = make(<path d="m9.5 6 6 6-6 6" />, "IconChevronRight");

export const IconChevronDown = make(<path d="m6 9.5 6 6 6-6" />, "IconChevronDown");

export const IconArrowLeft = make(<path d="M19 12H5M11 6l-6 6 6 6" />, "IconArrowLeft");

/** Ikon pot tanaman berbunga (FIX-03: menggantikan ikon kotak hadiah pada prototipe). */
export const IconPot = make(
  <>
    <path d="M6.5 13h11l-1.3 6.5a1 1 0 0 1-1 .8H8.8a1 1 0 0 1-1-.8zM5.5 11.5h13" />
    <path d="M12 11.5V6M12 8.5c-2.2-.2-3.5-1.5-3.5-3.5 2 0 3.3 1.3 3.5 3.5zM12 8.5c2.2-.2 3.5-1.5 3.5-3.5-2 0-3.3 1.3-3.5 3.5z" />
  </>,
  "IconPot",
);

/** Ikon stek berakar: batang, daun tunas, dan akar serabut. */
export const IconCutting = make(
  <>
    <path d="M12 4v10M12 7.5c-2.2 0-3.5-1-4-2.5 1.8-.3 3.2.7 4 2.5zM12 10c2.2 0 3.5-1 4-2.5-1.8-.3-3.2.7-4 2.5z" />
    <path d="M12 14c-1 2.2-2.5 3.8-4.5 5M12 14v6M12 14c1 2.2 2.5 3.8 4.5 5" />
  </>,
  "IconCutting",
);

/** Ikon varietas: dua bunga berbeda ukuran (FIX-03: bukan pin peta). */
export const IconVariety = make(
  <>
    <circle cx="8" cy="8.5" r="3" />
    <path d="M8 11.5V20M5.5 16.5c1-.7 1.8-.7 2.5 0" />
    <circle cx="16" cy="12" r="3.5" />
    <path d="M16 15.5V20" />
  </>,
  "IconVariety",
);

export const IconTag = make(
  <>
    <path d="M4 12.2V5a1 1 0 0 1 1-1h7.2l7.5 7.5a1.2 1.2 0 0 1 0 1.7l-5.5 5.5a1.2 1.2 0 0 1-1.7 0z" />
    <circle cx="8.5" cy="8.5" r="0.9" />
  </>,
  "IconTag",
);

export const IconChat = make(
  <>
    <path d="M4.5 6.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4.5 3v-3H4.5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
    <path d="M8 10.5h8M8 13.5h5" />
  </>,
  "IconChat",
);

export const IconHelp = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.5a2.4 2.4 0 1 1 3.7 2c-.8.5-1.3 1-1.3 2v.4M12 16.8v.1" />
  </>,
  "IconHelp",
);

export const IconMapPin = make(
  <>
    <path d="M12 20.5s6.5-5.5 6.5-10.5a6.5 6.5 0 1 0-13 0c0 5 6.5 10.5 6.5 10.5z" />
    <circle cx="12" cy="10" r="2.2" />
  </>,
  "IconMapPin",
);

export const IconShield = make(
  <>
    <path d="M12 3.5 5 6.5v5.3c0 4.5 3 8.1 7 9.2 4-1.1 7-4.7 7-9.2V6.5z" />
    <path d="m9.5 12.2 1.8 1.8 3.5-3.6" />
  </>,
  "IconShield",
);

/** Penanda merek: lima kelopak sederhana. Buatan sendiri, bukan logo institusi mana pun. */
export const IconFlower = make(
  <>
    <circle cx="12" cy="12" r="2" />
    <path d="M12 10c-2.5-1-2.5-5 0-6 2.5 1 2.5 5 0 6zM13.9 11.2c.6-2.7 4.4-3.7 6-1.6-.4 2.7-3.9 3.8-6 1.6zM13.2 13.4c2.5 1.2 2.9 5.2.4 6.4-2.4-.9-3.1-4.7-.4-6.4zM10.8 13.4c2.7 1.7 2 5.5-.4 6.4-2.5-1.2-2.1-5.2.4-6.4zM10.1 11.2c-2.1 2.2-5.6 1.1-6-1.6 1.6-2.1 5.4-1.1 6 1.6z" />
  </>,
  "IconFlower",
);
