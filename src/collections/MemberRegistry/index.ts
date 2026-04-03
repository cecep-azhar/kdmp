import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const MemberRegistry: CollectionConfig = {
  slug: 'member-registry',
  labels: {
    singular: 'Buku Induk',
    plural: 'Buku Induk Anggota',
  },
  admin: {
    useAsTitle: 'memberName',
    group: '9 Buku Koperasi',
    defaultColumns: ['registrationNumber', 'memberName', 'joinDate', 'status'],
    description: 'Buku Induk Anggota / Daftar Anggota Administratif',
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
          name: 'registrationNumber',
          type: 'text',
          required: true,
          label: 'Nomor Buku Induk / No_Anggota',
        },
        {
          name: 'memberName',
          type: 'text',
          required: true,
          label: 'Nama Lengkap Sesuai KTP',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'joinDate',
          type: 'date',
          required: true,
          label: 'Tanggal Masuk',
        },
        {
          name: 'leaveDate',
          type: 'date',
          label: 'Tanggal Keluar',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status Keanggotaan',
      options: [
        { label: 'Aktif', value: 'active' },
        { label: 'Non-Aktif', value: 'inactive' },
        { label: 'Keluar', value: 'left' },
      ],
    },
    {
      name: 'identityDetails',
      type: 'textarea',
      label: 'Nomor KTP & Detail Alamat',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Keterangan Keluar / Pindah',
    },
  ],
  timestamps: true,
}
