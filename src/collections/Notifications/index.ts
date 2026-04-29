import type { CollectionConfig } from 'payload'
import { isStaffOrAbove } from '../../access'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  labels: {
    singular: 'Notifikasi',
    plural: 'Data Notifikasi',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Pengaturan Sistem',
    defaultColumns: ['title', 'type', 'recipient', 'isRead', 'createdAt'],
    description: 'Sistem notifikasi untuk anggota dan admin',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('super-admin') || user.roles?.includes('pengurus')) return true
      // User hanya bisa melihat notifikasi miliknya
      return { recipient: { equals: user.id } }
    },
    create: isStaffOrAbove,
    update: ({ req: { user }, id, data }) => {
      if (!user) return false
      // Admin bisa update semua
      if (user.roles?.includes('super-admin') || user.roles?.includes('pengurus')) return true
      // User bisa mark read notifikasi miliknya
      return { recipient: { equals: user.id } }
    },
    delete: isStaffOrAbove,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul Notifikasi',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Isi Pesan',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'info',
      label: 'Jenis Notifikasi',
      options: [
        { label: 'Informasi', value: 'info' },
        { label: 'Peringatan', value: 'warning' },
        { label: 'Pinjaman', value: 'loan' },
        { label: 'Simpanan', value: 'savings' },
        { label: 'Toko/Transaksi', value: 'transaction' },
        { label: 'Pengumuman', value: 'announcement' },
        { label: 'Sistem', value: 'system' },
      ],
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Penerima',
      admin: {
        description: 'User yang akan menerima notifikasi ini',
      },
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sudah Dibaca',
      admin: {
        description: 'Centang jika notifikasi sudah dibaca',
      },
    },
    {
      name: 'readAt',
      type: 'date',
      label: 'Waktu Dibaca',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'relatedId',
      type: 'text',
      label: 'ID Referensi',
      admin: {
        description: 'ID dokumen yang terkait (loan, savings, transaction, dll)',
      },
    },
    {
      name: 'relatedType',
      type: 'select',
      label: 'Tipe Referensi',
      options: [
        { label: 'Pinjaman', value: 'loan' },
        { label: 'Simpanan', value: 'savings' },
        { label: 'Transaksi Toko', value: 'transaction' },
        { label: ' Anggota', value: 'member' },
        { label: 'Lainnya', value: 'other' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      label: 'Prioritas',
      options: [
        { label: 'Rendah', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'Tinggi', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Set readAt when isRead is true
        if (data?.isRead && !data?.readAt) {
          data.readAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  timestamps: true,
}