import type { CollectionConfig } from 'payload'
import { isLoggedIn, isStaffOrAbove } from '../../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Galeri Media',
  },
  admin: {
    group: 'Pengaturan Sistem',
    description: 'Upload dan manajemen file media',
  },
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isStaffOrAbove,
    delete: isStaffOrAbove,
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Keterangan',
    },
  ],
}
