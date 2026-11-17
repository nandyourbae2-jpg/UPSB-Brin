import type { MetadataRoute } from "next";
import { getEnv } from "@/env";

const publicRoutes = [
  "/",
  "/jelajah",
  "/produk",
  "/produk/fabiola",
  "/produk/claire",
  "/pesan",
  "/kemitraan",
  "/lacak",
  "/tentang",
  "/cara-pemesanan",
  "/faq",
  "/kontak",
  "/privasi",
  "/syarat",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getEnv().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
