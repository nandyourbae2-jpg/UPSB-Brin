import type { Metadata } from "next";
import { id } from "@/content/id";

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = `${title} | ${id.site.fullName}`;
  return {
    title: absoluteTitle ? { absolute: fullTitle } : title,
    description,
    alternates: noIndex ? undefined : { canonical: path },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${title} | ${id.site.name}`,
      description,
      url: path,
      siteName: id.site.fullName,
      locale: "id_ID",
      type: "website",
    },
  };
}
