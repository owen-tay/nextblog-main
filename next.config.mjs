/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['images.ctfassets.net'],
      formats: ['image/avif', 'image/webp'],
    },
  };
  
  export default nextConfig;