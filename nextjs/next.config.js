const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'production',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compress: process.env.NODE_ENV === 'development', // handled by nginx in production
    experimental: {
        scrollRestoration: true,
        images: {
            allowFutureImage: true,
            remotePatterns: [
                {
                    hostname: '**.siemens.com',
                },
            ],
        },
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

module.exports = withBundleAnalyzer(nextConfig);
