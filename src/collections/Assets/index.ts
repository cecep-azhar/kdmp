import type { CollectionConfig } from 'payload'
import { isStaffOrAbove, isAdminOrPengurus } from '../../access'

export const Assets: CollectionConfig = {
  slug: 'assets',
  admin: {
    useAsTitle: 'name',
    group: 'Inventaris',
    defaultColumns: ['assetCode', 'name', 'acquisitionDate', 'condition', 'currentValue'],
    description: 'Buku Inventaris - Pencatatan aset koperasi',
  },
  access: {
    read: isAdminOrPengurus,
    create: isStaffOrAbove,
    update: isStaffOrAbove,
    delete: isAdminOrPengurus,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'assetCode',
          type: 'text',
          required: true,
          unique: true,
          label: 'Kode Aset',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nama Aset',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Deskripsi',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      options: [
        { label: 'Tanah & Bangunan', value: 'property' },
        { label: 'Kendaraan', value: 'vehicle' },
        { label: 'Peralatan Kantor', value: 'office-equipment' },
        { label: 'Peralatan Elektronik', value: 'electronics' },
        { label: 'Furniture', value: 'furniture' },
        { label: 'Lainnya', value: 'other' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'acquisitionDate',
          type: 'date',
          required: true,
          label: 'Tanggal Perolehan',
        },
        {
          name: 'acquisitionCost',
          type: 'number',
          required: true,
          min: 0,
          label: 'Harga Perolehan (Rp)',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'currentValue',
          type: 'number',
          min: 0,
          label: 'Nilai Saat Ini (Rp)',
        },
        {
          name: 'condition',
          type: 'select',
          label: 'Kondisi',
          options: [
            { label: 'Baik', value: 'good' },
            { label: 'Rusak Ringan', value: 'fair' },
            { label: 'Rusak Berat', value: 'poor' },
            { label: 'Dihapuskan', value: 'disposed' },
          ],
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      label: 'Lokasi',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Aset',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Catatan',
    },
  ],
  timestamps: true,
}
