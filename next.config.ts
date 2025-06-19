

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jfqabsvncgnvpyfttdwa.supabase.co', // <-- GANTI DENGAN HOSTNAME ANDA
        port: '',
        pathname: '/storage/v1/object/public/**', // Izinkan semua gambar dari storage
        
      },
    ],
  },
};

export default nextConfig;