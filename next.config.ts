import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    // Announcements are a section of the events page now, not a page of their own.
    return [
      {
        source: "/announcements",
        destination: "/events#announcements",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
