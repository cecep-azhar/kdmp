import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const Ledger: CollectionConfig = {
  slug: 'ledger',
  labels: {
    singular: 'Buku Besar',
    plural: 'Jurnal Umum',
  },
  admin: {
    useAsTitle: 'description',
    group: 'Keuangan',
    defaultColumns: ['date', 'description', 'reference', 'createdAt'],
    description: 'Jurnal Umum - Pencatatan setiap mutasi keuangan',
  },
  access: {
    read: isAdminOrPengurus,
    create: isStaffOrAbove,
    update: isAdminOrPengurus,
    delete: ({ req: { user } }) => {
      // Jurnal tidak boleh dihapus, hanya bisa dikoreksi
      if (!user) return false
      return false
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        // Validasi: total debit harus sama dengan total kredit
        if (data?.entries && Array.isArray(data.entries)) {
          const totalDebit = data.entries.reduce(
            (sum: number, entry: { debit?: number }) => sum + (entry.debit || 0),
            0,
          )
          const totalCredit = data.entries.reduce(
            (sum: number, entry: { credit?: number }) => sum + (entry.credit || 0),
            0,
          )

          if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new Error(
              `Jurnal tidak balance. Total Debit: ${totalDebit}, Total Kredit: ${totalCredit}`,
            )
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Tanggal',
      defaultValue: () => new Date().toISOString(),
      index: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Deskripsi / Keterangan',
    },
    {
      name: 'entries',
      type: 'array',
      required: true,
      minRows: 2,
      label: 'Entri Jurnal',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'account',
              type: 'text',
              required: true,
              label: 'Kode Akun',
              admin: {
                description: 'Masukkan kode akun dari Chart of Accounts',
              },
            },
            {
              name: 'accountName',
              type: 'text',
              label: 'Nama Akun',
              admin: {
                readOnly: true,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'debit',
              type: 'number',
              defaultValue: 0,
              min: 0,
              label: 'Debit (Rp)',
            },
            {
              name: 'credit',
              type: 'number',
              defaultValue: 0,
              min: 0,
              label: 'Kredit (Rp)',
            },
          ],
        },
      ],
    },
    {
      name: 'reference',
      type: 'text',
      label: 'Referensi',
      admin: {
        description: 'Referensi ke dokumen sumber (contoh: savings/123)',
      },
      index: true,
    },
    {
      name: 'journalType',
      type: 'select',
      label: 'Tipe Jurnal',
      defaultValue: 'general',
      options: [
        { label: 'Jurnal Umum', value: 'general' },
        { label: 'Jurnal Kas Masuk', value: 'cash-in' },
        { label: 'Jurnal Kas Keluar', value: 'cash-out' },
        { label: 'Jurnal Penyesuaian', value: 'adjustment' },
        { label: 'Jurnal Penutup', value: 'closing' },
      ],
    },
    {
      name: 'isPosted',
      type: 'checkbox',
      defaultValue: true,
      label: 'Sudah Diposting',
    },
    {
      name: 'createdByUser',
      type: 'relationship',
      relationTo: 'users',
      label: 'Dibuat Oleh',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
