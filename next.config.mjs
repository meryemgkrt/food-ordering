/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Netlify için static export
  output: "export",
  trailingSlash: true,

  images: {
    // Netlify static export için unoptimized gerekli
    unoptimized: true,
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

  // Netlify için ek ayarlar
  distDir: "out",

  // API routes'ları devre dışı bırak (static export için)
  // Eğer API routes kullanıyorsan bu satırı kaldır
  experimental: {
    // missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
