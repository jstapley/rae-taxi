/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['mkegrugusxbmkoenadbm.supabase.co'],
  },
  async redirects() {
    return [
      { source: '/vehicles', destination: '/car-rental', permanent: true },
    ];
  },
};

module.exports = nextConfig;
