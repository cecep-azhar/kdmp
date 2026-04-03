import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Members } from './collections/Members'
import { Savings } from './collections/Savings'
import { Loans } from './collections/Loans'
import { Accounts } from './collections/Accounts'
import { Ledger } from './collections/Ledger'
import { Products } from './collections/Products'
import { Transactions } from './collections/Transactions'
import { Assets } from './collections/Assets'
import { Logs } from './collections/Logs'
import { GuestBook } from './collections/GuestBook'
import { Meetings } from './collections/Meetings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | Koperasi Merah Putih',
      description: 'Sistem Informasi Koperasi Merah Putih',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
      views: {
        dashboard: {
          Component: '@/components/admin/Dashboard',
        },
      },
      afterNavLinks: ['@/components/admin/NavFooter'],
    },
    dateFormat: 'dd MMMM yyyy',
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    Users,
    Media,
    Members,
    Savings,
    Loans,
    Accounts,
    Ledger,
    Products,
    Transactions,
    Assets,
    Logs,
    GuestBook,
    Meetings,
  ],
  plugins: [
    // S3 Storage - enable only when S3 credentials are configured
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: {
              media: {
                disablePayloadAccessControl: true,
                prefix: 'media',
              },
            },
            bucket: process.env.S3_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
              region: process.env.S3_REGION || 'ap-southeast-1',
              ...(process.env.S3_ENDPOINT
                ? {
                    endpoint: process.env.S3_ENDPOINT,
                    forcePathStyle: true,
                  }
                : {}),
            },
          }),
        ]
      : []),
  ],
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
