import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false,
  },
  // Keep heavy Payload dependencies out of lightweight API routes
  serverExternalPackages: ['payload', '@payloadcms/next'],
  transpilePackages: ['react-image-crop'],
}

export default withPayload(nextConfig)

// Trigger Next.js Dev Server Restart
