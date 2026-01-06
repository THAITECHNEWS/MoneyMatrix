/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Enable standalone output for Docker
  images: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com'],
  },
}

module.exports = nextConfig
