import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { id } from "@/content/id";
import { getEnv } from "@/env";
import "@/styles/globals.css";

// Plus Jakarta Sans (SIL OFL), dihosting sendiri: build tidak butuh jaringan.
const plusJakarta = localFont({
  src: "../fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-plus-jakarta",
  display: "swap",
});

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(getEnv().NEXT_PUBLIC_SITE_URL),
    title: { default: id.site.fullName, template: `%s | ${id.site.name}` },
    description: id.site.description,
    openGraph: {
      title: id.site.fullName,
      description: id.site.description,
      siteName: id.site.fullName,
      locale: "id_ID",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#1A0E14" },
  ],
};

// Menerapkan tema tersimpan sebelum cat pertama, mencegah kilatan tema salah.
const themeBootstrap = `try{var t=localStorage.getItem("upsb-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <ToastProvider closeLabel={id.toast.close}>{children}</ToastProvider>
      </body>
    </html>
  );
}
