import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const Supervisors: CollectionConfig = {
  slug: 'supervisors',
  labels: {
    singular: 'Pengawas',
    plural: 'Daftar Pengawas',
  },
  admin: {
    useAsTitle: 'member',
    hidden: true,
    defaultColumns: ['member', 'position', 'periodStart', 'status'],
    description: 'Buku Daftar Pengawas',
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
      label: 'Nama Anggota',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'position',
          type: 'select',
          required: true,
          label: 'Jabatan',
          options: [
            { label: 'Ketua Pengawas', value: 'head' },
            { label: 'Anggota Pengawas', value: 'member' },
            { label: 'Pengawas Ahli', value: 'expert' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'active',
          label: 'Status',
          options: [
            { label: 'Aktif', value: 'active' },
            { label: 'Non-Aktif', value: 'inactive' },
            { label: 'Berhenti', value: 'resigned' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'periodStart',
          type: 'date',
          required: true,
          label: 'Mulai Menjabat',
        },
        {
          name: 'periodEnd',
          type: 'date',
          label: 'Selesai Menjabat',
        },
      ],
    },
    {
      name: 'expertise',
      type: 'text',
      label: 'Bidang Keahlian',
    },
    {
      name: 'contactInfo',
      type: 'textarea',
      label: 'Informasi Kontak & Alamat',
    },
  ],
  timestamps: true,
}
