import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }, { hostname: "covers.openlibrary.org" }, { hostname: "ubrrjkpicukdr7ok.public.blob.vercel-storage.com" }]
  }
};

export default nextConfig;
