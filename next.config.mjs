import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    reactCompiler: false,
  },
  // Keep heavy Payload core out of lightweight routes (reduces serverless bundle size)
  serverExternalPackages: ['payload'],
  // Transpile UI packages for CSS/ESM compatibility
  transpilePackages: [
    '@payloadcms/ui',
    '@payloadcms/richtext-lexical',
    'react-image-crop',
  ],
}

export default withPayload(nextConfig)

// Trigger Next.js Dev Server Restart
