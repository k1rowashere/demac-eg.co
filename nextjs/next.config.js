/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = {
    experimental: {
        scrollRestoration: true,
        images: {
            remotePatterns: [
                {
                    hostname: '**.siemens.com'
                }
            ]
        }
    },
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })
        return config;
    }
}