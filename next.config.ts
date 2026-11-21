import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/thefive",
        destination: "/themix",
        permanent: true,
      },
      {
        source: "/thefive/:path*",
        destination: "/themix/:path*",
        permanent: true,
      },
      {
        source: "/executive-edit",
        destination: "/themix",
        permanent: true,
      },
      {
        source: "/executive-edit/:path*",
        destination: "/themix/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
