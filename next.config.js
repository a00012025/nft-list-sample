/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', 'openseauserdata.com', 'lh3.googleusercontent.com',
    ],
  },
}

module.exports = nextConfig
