/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  // GitHub Pages support (enabled via GITHUB_PAGES env var in CI)
  basePath: process.env.GITHUB_PAGES ? '/door-runner-memory' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/door-runner-memory/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
