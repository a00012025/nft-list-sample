/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };
    return config;
  },
  swcMinify: true,
  images: {
    domains: ["ipfs.io", "openseauserdata.com", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
