import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const Logs: CollectionConfig = {
  slug: 'logs',
  labels: {
    singular: 'Kejadian',
    plural: 'Buku Kejadian Penting',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Sekretariat',
    defaultColumns: ['date', 'title', 'category', 'importance'],
    description: 'Buku Kejadian Penting - Pencatatan peristiwa penting koperasi',
  },
  access: {
    read: isAdminOrPengurus,
    create: isStaffOrAbove,
    update: isAdminOrPengurus,
    delete: isAdminOrPengurus,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Tanggal Kejadian',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul Kejadian',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      options: [
        { label: 'Keorganisasian', value: 'organizational' },
        { label: 'Keuangan', value: 'financial' },
        { label: 'Hukum / Perizinan', value: 'legal' },
        { label: 'Kegiatan / Acara', value: 'event' },
        { label: 'Kerjasama', value: 'partnership' },
        { label: 'Lainnya', value: 'other' },
      ],
    },
    {
      name: 'importance',
      type: 'select',
      defaultValue: 'normal',
      label: 'Tingkat Kepentingan',
      options: [
        { label: 'Tinggi', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Rendah', value: 'low' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Uraian Kejadian',
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Lampiran',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'File',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Keterangan',
        },
      ],
    },
    {
      name: 'recordedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Dicatat Oleh',
    },
  ],
  timestamps: true,
}
