/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true, // optional but great for local speed
  },

  pageExtensions: ['page.tsx', 'page.jsx', 'ts', 'tsx', 'js', 'jsx'],

  // Reduce file-watching overhead (especially helpful on Windows)
  watchOptions: {
    ignored: ['**/node_modules/**', '**/.next/**'],
  },
};

export default nextConfig;
