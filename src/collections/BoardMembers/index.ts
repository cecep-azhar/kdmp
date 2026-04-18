import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  labels: {
    singular: 'Pengurus',
    plural: 'Daftar Pengurus',
  },
  admin: {
    useAsTitle: 'member',
    group: 'Keanggotaan & SDM',
    defaultColumns: ['member', 'position', 'periodStart', 'periodEnd', 'status'],
    description: 'Buku Daftar Pengurus',
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
            { label: 'Ketua', value: 'chairman' },
            { label: 'Wakil Ketua', value: 'vice_chairman' },
            { label: 'Sekretaris', value: 'secretary' },
            { label: 'Bendahara', value: 'treasurer' },
            { label: 'Anggota', value: 'member' },
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
      name: 'contactInfo',
      type: 'textarea',
      label: 'Informasi Kontak & Alamat',
    },
  ],
  timestamps: true,
}
