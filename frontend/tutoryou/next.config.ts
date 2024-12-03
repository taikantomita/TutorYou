import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

module.exports = {
  async rewrites() {
    return [
      {
        source: '/tutors/:path*',
        destination: '/tutor-only-pages/:path*',
      },
      {
        source: '/students/:path*',
        destination: '/student-only-pages/:path*',
      },
    ]
  },
}

export default nextConfig
