import withMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

/** @type {import('next').NextConfig} */
const nextConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
})({
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // Compression optimizations for static export
  compress: true,
  // Generate static files with proper headers for compression
  generateEtags: true,
  // Optimize for static hosting and compression
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = {
      fs: false,
    };

    // Production optimizations for compression and CSS splitting
    if (!dev && !isServer) {
      // Enable gzip compression in webpack for better bundle analysis
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.(css|scss|sass)$/,
              chunks: 'all',
              enforce: true,
            },
            // React core libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              priority: 30,
              chunks: 'all',
            },
            // Next.js core
            next: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'next',
              priority: 20,
              chunks: 'all',
            },
            // UI libraries (Radix UI components)
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|motion)[\\/]/,
              name: 'ui',
              priority: 15,
              chunks: 'all',
            },
            // Utility libraries
            utils: {
              test: /[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority|react-use)[\\/]/,
              name: 'utils',
              priority: 10,
              chunks: 'all',
            },
            // Remaining vendor libraries (using negative lookahead)
            vendor: {
              test: /[\\/]node_modules[\\/](?!(react|react-dom|scheduler|next|@radix-ui|framer-motion|motion|clsx|tailwind-merge|class-variance-authority|react-use)[\\/])/,
              name: 'vendor',
              priority: -10,
              chunks: 'all',
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
});

export default nextConfig;
