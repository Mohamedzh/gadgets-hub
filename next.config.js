/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fdn.gsmarena.com/**",
      },
      {
        protocol: "https",
        hostname: "m-cdn.phonearena.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "fdn2.gsmarena.com",
      },
    ],
  },
};

module.exports = nextConfig;
