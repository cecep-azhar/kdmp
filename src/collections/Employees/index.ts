import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const Employees: CollectionConfig = {
  slug: 'employees',
  labels: {
    singular: 'Karyawan',
    plural: 'Daftar Karyawan',
  },
  admin: {
    useAsTitle: 'member',
    hidden: true,
    defaultColumns: ['member', 'position', 'hireDate', 'status'],
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
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      label: 'Nama Anggota (Karyawan)',
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
