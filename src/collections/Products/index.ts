import type { CollectionConfig } from 'payload'
import { isStaffOrAbove, isKasirOrAbove, isAdminOrPengurus } from '../../access'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'POS',
    defaultColumns: ['sku', 'name', 'price', 'stock', 'isActive'],
    description: 'Inventaris barang untuk Point of Sale',
  },
  access: {
    read: isKasirOrAbove,
    create: isStaffOrAbove,
    update: isStaffOrAbove,
    delete: isAdminOrPengurus,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'sku',
          type: 'text',
          required: true,
          unique: true,
          label: 'SKU / Kode Barang',
        },
        {
          name: 'barcode',
          type: 'text',
          label: 'Barcode',
        },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Barang',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Deskripsi',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Barang',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          label: 'Kategori',
          options: [
            { label: 'Sembako', value: 'groceries' },
            { label: 'Minuman', value: 'beverages' },
            { label: 'Makanan Ringan', value: 'snacks' },
            { label: 'Perlengkapan', value: 'supplies' },
            { label: 'Elektronik', value: 'electronics' },
            { label: 'Lainnya', value: 'other' },
          ],
        },
        {
          name: 'unit',
          type: 'select',
          defaultValue: 'pcs',
          label: 'Satuan',
          options: [
            { label: 'Pcs', value: 'pcs' },
            { label: 'Kg', value: 'kg' },
            { label: 'Liter', value: 'liter' },
            { label: 'Pack', value: 'pack' },
            { label: 'Box', value: 'box' },
            { label: 'Lusin', value: 'dozen' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'costPrice',
          type: 'number',
          required: true,
          min: 0,
          label: 'Harga Beli (Rp)',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Harga Jual (Rp)',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'stock',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
          label: 'Stok',
        },
        {
          name: 'minStock',
          type: 'number',
          defaultValue: 5,
          label: 'Stok Minimum',
          admin: {
            description: 'Alert ketika stok dibawah angka ini',
          },
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif',
    },
  ],
  timestamps: true,
}
