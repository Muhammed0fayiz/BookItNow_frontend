

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "files.edgestore.dev",
      "i.pravatar.cc",
      "lh3.googleusercontent.com", 
    ],
  },
  experimental: {
    runtime: 'nodejs',
  },
};


export default nextConfig;


  