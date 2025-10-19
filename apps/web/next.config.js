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

    // Production optimizations for compression
    if (!dev && !isServer) {
      // Enable gzip compression in webpack for better bundle analysis
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }

    return config;
  },
});

export default nextConfig;
