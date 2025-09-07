/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://abitus-api.geia.vip/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
