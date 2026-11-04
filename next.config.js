/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'placehold.co',
      'images.unsplash.com',
      'amzptluvdjihwluolufa.supabase.co',
    ],
  },
  // Allow serving games from the public/games directory
  async headers() {
    return [
      {
        source: '/games/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
