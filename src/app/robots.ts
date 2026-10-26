import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Authenticated app areas and the sign-in step have no search value.
        disallow: ["/admin", "/admin/", "/dashboard", "/login", "/auth/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
