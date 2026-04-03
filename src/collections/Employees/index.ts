import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const Employees: CollectionConfig = {
  slug: 'employees',
  labels: {
    singular: 'Karyawan',
    plural: 'Daftar Karyawan',
  },
  admin: {
    useAsTitle: 'name',
    group: '9 Buku Koperasi',
    defaultColumns: ['name', 'position', 'hireDate', 'status'],
    description: 'Buku Daftar Karyawan / Pegawai',
  },
  access: {
    read: isAdminOrPengurus,
    create: isStaffOrAbove,
    update: isStaffOrAbove,
    delete: isAdminOrPengurus,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Lengkap',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'position',
          type: 'text',
          required: true,
          label: 'Posisi / Jabatan',
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'active',
          label: 'Status Karyawan',
          options: [
            { label: 'Aktif', value: 'active' },
            { label: 'Cuti', value: 'on_leave' },
            { label: 'Berhenti / Resign', value: 'resigned' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'hireDate',
          type: 'date',
          required: true,
          label: 'Tanggal Masuk (Awal Bekerja)',
        },
        {
          name: 'resignationDate',
          type: 'date',
          label: 'Tanggal Berhenti',
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'textarea',
      label: 'Informasi Kontak & Alamat',
    },
  ],
  timestamps: true,
}
