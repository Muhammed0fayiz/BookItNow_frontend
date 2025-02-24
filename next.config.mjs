/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

const envConfig = dotenv.config({ path: '.env.local' });

const nextConfig = {
  images: {
    domains: [
      "files.edgestore.dev",
      "i.pravatar.cc",
      "lh3.googleusercontent.com", 
    ],
  },
  env: {
    ...(envConfig.parsed || {})
  }
};

export default nextConfig;