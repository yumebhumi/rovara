import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ROVARA",
    short_name: "ROVARA",
    description: "AI-powered travel planning platform",
    start_url: "/",
    display: "standalone",
    background_color: "#071739",
    theme_color: "#071739",
    icons: [{ src: "/icon.png", sizes: "192x192", type: "image/png" }]
  };
}
