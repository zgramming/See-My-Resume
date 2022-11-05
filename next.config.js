/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "api.seemycv"],
  },
};

module.exports = nextConfig;
