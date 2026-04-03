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
import { BoardMembers } from './collections/BoardMembers'
import { Supervisors } from './collections/Supervisors'
import { Employees } from './collections/Employees'
import { MemberRegistry } from './collections/MemberRegistry'
import { Suggestions } from './collections/Suggestions'
import { MailLog } from './collections/MailLog'

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
      },
      afterNavLinks: ['@/components/admin/NavFooter'],
    },
    dateFormat: 'dd MMMM yyyy',
  },
  editor: lexicalEditor(),
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
    Users,
    Members,
    Savings,
    Loans,
    Accounts,
    Ledger,
    Products,
    Transactions,
    Assets,
    MemberRegistry,
    BoardMembers,
    Supervisors,
    Employees,
    GuestBook,
    Suggestions,
    MailLog,
    Logs,
    Meetings,
    Media,
  ],
  globals: [
    Settings,
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
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  csrf: ['http://localhost:3000', 'http://localhost:3001'],
})
