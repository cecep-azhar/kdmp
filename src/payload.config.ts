import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, FixedToolbarFeature, HeadingFeature } from '@payloadcms/richtext-lexical'
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
import { BoardMembers } from './collections/BoardMembers'
import { Supervisors } from './collections/Supervisors'
import { Employees } from './collections/Employees'
import { Suggestions } from './collections/Suggestions'
import { MailLog } from './collections/MailLog'
import { News } from './collections/News'
// SixteenBooksNav is registered via string path in beforeNavLinks (required by Payload v3 importMap)

// Globals
import { Settings } from './globals/Settings'

// Translations
import { id } from '@payloadcms/translations/languages/id'
import { en } from '@payloadcms/translations/languages/en'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | KDMP',
      description: 'Sistem Informasi Koperasi',
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
        reports: {
          Component: '@/components/admin/Reports',
          path: '/reports',
        },
      },
      // afterNavLinks: ['@/components/admin/NavFooter'],
      beforeNavLinks: ['@/components/admin/SixteenBooksNav#SixteenBooksNav'],
    },
    dateFormat: 'dd MMMM yyyy',
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      FixedToolbarFeature(),
    ],
  }),
  i18n: {
    supportedLanguages: { id, en },
    fallbackLanguage: 'id',
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    BoardMembers,
    Supervisors,
    Employees,
    GuestBook,
    Suggestions,
    MailLog,
    Logs,
    Meetings,
    Assets,
    Members,
    Savings,
    Loans,
    Accounts,
    Ledger,
    Products,
    Transactions,
    News,
    

    Users,
    Media,
  ],
  globals: [
    Settings,
  ],
  plugins: [
    // S3 Storage - enable only when S3 credentials are configured and NOT placeholders
    ...(process.env.S3_BUCKET && 
        process.env.S3_ACCESS_KEY_ID && 
        !process.env.S3_ACCESS_KEY_ID.startsWith('your-')
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
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  csrf: process.env.CSRF_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
})
