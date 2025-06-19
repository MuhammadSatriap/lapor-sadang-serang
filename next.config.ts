

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jfqabsvncgnvpyfttdwa.supabase.co', // <-- GANTI DENGAN HOSTNAME ANDA
        port: '',
        pathname: '/storage/v1/object/public/**', // Izinkan semua gambar dari storage
        unoptimized: true,
      },
    ],
  },
};

export default nextConfig;