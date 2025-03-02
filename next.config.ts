import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   serverActions: true,
  //   mdxRs: true,
  //   serverComponentsExternalPackages: ['mongoose']
  // }
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "static.vecteezy.com",
    //     port: "",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "lh3.googleusercontent.com",
    //     port: "",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "avatars.githubusercontent.com",
    //     port: "",
    //   },
    // ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      },
      {
        protocol: 'http',
        hostname: '*'
      },
    ]
  },
};

export default nextConfig;
