/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  transpilePackages: ['react-floating-button', 'react-lite-youtube-embed'],
  images: {
    domains: [
      'platform-lookaside.fbsbx.com',
      'lh3.googleusercontent.com',
      'localhost',
      'app.lofily.com',
      'azuracast.lofily.com',
    ],
    minimumCacheTTL: 3600,
  },
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: false,

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    // Configuration pour gérer les modules ES
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };

    return config;
  },
  i18n,
};

module.exports = nextConfig;
