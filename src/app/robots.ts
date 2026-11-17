import type { MetadataRoute } from "next";
import { getEnv, isProductionDeploy } from "@/env";

// Non-produksi tidak boleh terindeks (konten belum terverifikasi).
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getEnv().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return isProductionDeploy()
    ? {
        rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/trace", "/api", "/gangguan", "/kitchen-sink"] },
        sitemap: `${baseUrl}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
