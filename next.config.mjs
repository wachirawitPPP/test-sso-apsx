/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**', // Allow any hostname
          },
        ],
      },
};

export default nextConfig;
