import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

module.exports = {
  async redirects() {
    return [
      {
        source: '/tutor-only-pages/:path*', // Matches any route under tutor-only-pages
        destination: '/login', // Redirect to the home page or an appropriate page
        permanent: false, // Use 307 for temporary redirect
      },
    ]
  },
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
