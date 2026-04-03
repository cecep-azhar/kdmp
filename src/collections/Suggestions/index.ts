import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const Suggestions: CollectionConfig = {
  slug: 'suggestions',
  labels: {
    singular: 'Saran',
    plural: 'Saran & Anjuran',
  },
  admin: {
    useAsTitle: 'subject',
    group: '9 Buku Koperasi',
    defaultColumns: ['date', 'subject', 'submittedBy', 'status'],
    description: 'Buku Anjuran Khusus / Saran Anggota & Pejabat',
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
      label: 'Tanggal Masuk',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Perihal / Judul Saran',
    },
    {
      name: 'submittedBy',
      type: 'text',
      required: true,
      label: 'Nama Pengirim (Anggota/Pejabat/Instansi)',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Isi Saran / Anjuran',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'unread',
      label: 'Status Penanganan',
      options: [
        { label: 'Belum Dibaca', value: 'unread' },
        { label: 'Dalam Perhatian', value: 'in_review' },
        { label: 'Telah Ditindaklanjuti', value: 'resolved' },
      ],
    },
    {
      name: 'response',
      type: 'textarea',
      label: 'Tanggapan / Tindak Lanjut Pengurus',
    },
  ],
  timestamps: true,
}
