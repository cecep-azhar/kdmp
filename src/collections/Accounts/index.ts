import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isSuperAdmin } from '../../access'

export const Accounts: CollectionConfig = {
  slug: 'accounts',
  labels: {
    singular: 'Akun Keuangan',
    plural: 'Bagan Akun',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Keuangan',
    defaultColumns: ['code', 'name', 'type', 'category'],
    description: 'Chart of Accounts (Daftar Akun Akuntansi)',
  },
  access: {
    read: isAdminOrPengurus,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
          unique: true,
          label: 'Kode Akun',
          admin: {
            description: 'Format: X-XXXX (contoh: 1-1001)',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nama Akun',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Tipe Akun',
          options: [
            { label: 'Aset', value: 'asset' },
            { label: 'Kewajiban', value: 'liability' },
            { label: 'Ekuitas', value: 'equity' },
            { label: 'Pendapatan', value: 'revenue' },
            { label: 'Beban', value: 'expense' },
          ],
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          label: 'Kategori',
          options: [
            { label: 'Kas & Bank', value: 'cash' },
            { label: 'Piutang', value: 'receivable' },
            { label: 'Persediaan', value: 'inventory' },
            { label: 'Aset Tetap', value: 'fixed-asset' },
            { label: 'Simpanan Anggota', value: 'member-savings' },
            { label: 'Hutang', value: 'payable' },
            { label: 'Modal', value: 'capital' },
            { label: 'Pendapatan Bunga', value: 'interest-income' },
            { label: 'Pendapatan Usaha', value: 'business-income' },
            { label: 'Beban Operasional', value: 'operational-expense' },
            { label: 'Beban Bunga', value: 'interest-expense' },
            { label: 'Lainnya', value: 'other' },
          ],
        },
      ],
    },
    {
      name: 'normalBalance',
      type: 'select',
      required: true,
      label: 'Saldo Normal',
      options: [
        { label: 'Debit', value: 'debit' },
        { label: 'Kredit', value: 'credit' },
      ],
    },
    {
      name: 'parentAccount',
      type: 'relationship',
      relationTo: 'accounts',
      label: 'Akun Induk',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Deskripsi',
    },
  ],
  timestamps: true,
}
