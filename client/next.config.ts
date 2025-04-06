import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            { protocol: 'https', hostname: 'cdn.tuoitre.vn' },
            { protocol: 'https', hostname: 'cafefcdn.com' },
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
