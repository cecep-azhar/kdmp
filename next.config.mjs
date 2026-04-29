import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false,
  },
  // Transpile Payload and its UI dependencies to handle CSS imports and ESM compatibility
  transpilePackages: [
    '@payloadcms/next',
    '@payloadcms/ui',
    '@payloadcms/richtext-lexical',
    'react-image-crop',
  ],
}

export default withPayload(nextConfig)

// Trigger Next.js Dev Server Restart
