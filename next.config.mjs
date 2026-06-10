/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  allowedDevOrigins: ['21.0.21.140', '127.0.0.1', 'localhost'],
};

export default nextConfig;
