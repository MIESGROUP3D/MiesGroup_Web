import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// sitio estático (output: "export"): se genera una sola vez en el build
export const dynamic = "force-static";

/**
 * ⚠ MOCKUP: bloquea la indexación. En producción cambiar a:
 *   rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }
 * y quitar `robots` de metadata en src/app/layout.tsx.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
