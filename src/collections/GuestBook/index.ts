import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const GuestBook: CollectionConfig = {
  slug: 'guest-book',
  labels: {
    singular: 'Buku Tamu',
    plural: 'Daftar Buku Tamu',
  },
  admin: {
    useAsTitle: 'guestName',
    group: 'Sekretariat',
    defaultColumns: ['date', 'guestName', 'organization', 'purpose'],
    description: 'Buku Anjuran Pejabat / Buku Tamu',
  },
  access: {
    read: isAdminOrPengurus,
    create: isStaffOrAbove,
    update: isStaffOrAbove,
    delete: isAdminOrPengurus,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Tanggal Kunjungan',
      defaultValue: () => new Date().toISOString(),
    },
    {
      type: 'row',
      fields: [
        {
          name: 'guestName',
          type: 'text',
          required: true,
          label: 'Nama Tamu / Pejabat',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Jabatan',
        },
      ],
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Instansi / Organisasi',
    },
    {
      name: 'purpose',
      type: 'select',
      label: 'Tujuan Kunjungan',
      options: [
        { label: 'Pembinaan', value: 'coaching' },
        { label: 'Pengawasan', value: 'supervision' },
        { label: 'Kunjungan Kerja', value: 'visit' },
        { label: 'Kerjasama', value: 'partnership' },
        { label: 'Lainnya', value: 'other' },
      ],
    },
    {
      name: 'message',
      type: 'richText',
      label: 'Pesan / Anjuran / Rekomendasi',
    },
    {
      name: 'followUpActions',
      type: 'textarea',
      label: 'Tindak Lanjut',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Dokumentasi',
    },
    {
      name: 'receivedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Diterima Oleh',
    },
  ],
  timestamps: true,
}
