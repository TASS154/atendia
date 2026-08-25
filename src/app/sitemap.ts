import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://atendia-kappa.vercel.app";
  return ["", "/precos", "/sobre", "/casos", "/contato", "/login"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
