/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Logları kapatmak için
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
