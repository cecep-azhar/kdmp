import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'Berita',
    plural: 'Berita & Informasi',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Informasi',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  access: {
    read: () => true, // Semua bisa baca berita
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.some((role: string) => ['super-admin', 'pengurus', 'staff'].includes(role))
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.some((role: string) => ['super-admin', 'pengurus', 'staff'].includes(role))
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.some((role: string) => ['super-admin'].includes(role))
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul Berita',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'Digunakan untuk URL (misal: berita-koperasi-2026)',
      }
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'news',
      label: 'Kategori',
      options: [
        { label: 'Berita', value: 'news' },
        { label: 'Pengumuman', value: 'announcement' },
        { label: 'Edukasi', value: 'education' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Konten',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar Utama',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Status',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Publikasikan', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Tanggal Publikasi',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ data, operation, value }) => {
            if (operation === 'create' || operation === 'update') {
              if (data?.status === 'published' && !value) {
                return new Date().toISOString()
              }
            }
            return value
          },
        ],
      },
    },
  ],
  timestamps: true,
}
