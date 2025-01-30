/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'example.com', // Specific trusted domain
      'res.cloudinary.com', // Cloudinary image hosting
      'githubusercontent.com', // GitHub user content
      'randomuser.me', // Allow HTTP images from randomuser.me (mock pics)
      // Add other trusted domains as needed
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images
      },
      {
        protocol: 'http',
        hostname: 'randomuser.me',
      },
    ],
  },
}

module.exports = nextConfig
