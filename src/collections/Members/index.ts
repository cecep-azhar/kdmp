import type { CollectionConfig } from 'payload'
import { checkRole } from '../../access/checkRole'
import { isStaffOrAbove, isAdminOrPengurus } from '../../access'

export const Members: CollectionConfig = {
  slug: 'members',
  labels: {
    singular: 'Buku Induk Anggota',
    plural: 'Buku Induk Anggota',
  },
  admin: {
    useAsTitle: 'fullName',
    group: 'Keanggotaan & SDM',
    defaultColumns: ['memberId', 'fullName', 'membershipStatus', 'joinDate'],
    description: 'Buku Induk / Data Pokok Anggota Koperasi',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['super-admin', 'pengurus', 'staff'], user)) return true
      // Anggota hanya bisa melihat data milik sendiri
      return { user: { equals: user.id } }
    },
    create: isStaffOrAbove,
    update: isStaffOrAbove,
    delete: isAdminOrPengurus,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // BUG FIX #4: Use timestamp-based ID to prevent race condition
        // Format: KMP-YYYYMMDD-XXXXX (5 digit random suffix)
        if (operation === 'create' && !data?.memberId) {
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          // Use timestamp + random suffix instead of count-based to avoid race condition
          const randomSuffix = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
          data.memberId = `KMP-${dateStr}-${randomSuffix}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'memberId',
      type: 'text',
      unique: true,
      label: 'No. Anggota',
      admin: {
        readOnly: true,
        description: 'Akan digenerate otomatis',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Akun Pengguna',
      hasMany: false,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Data Pribadi',
          fields: [
            {
              name: 'fullName',
              type: 'text',
              required: true,
              label: 'Nama Lengkap',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'nik',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'NIK',
                  minLength: 16,
                  maxLength: 16,
                  access: {
                    read: ({ req: { user } }) => checkRole(['super-admin', 'pengurus', 'staff'], user),
                  },
                },
                {
                  name: 'gender',
                  type: 'select',
                  label: 'Jenis Kelamin',
                  options: [
                    { label: 'Laki-laki', value: 'male' },
                    { label: 'Perempuan', value: 'female' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'birthPlace',
                  type: 'text',
                  label: 'Tempat Lahir',
                },
                {
                  name: 'birthDate',
                  type: 'date',
                  label: 'Tanggal Lahir',
                },
              ],
            },
            {
              name: 'phone',
              type: 'text',
              label: 'No. Telepon',
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Alamat',
            },
            {
              name: 'occupation',
              type: 'text',
              label: 'Pekerjaan',
            },
          ],
        },
        {
          label: 'Keanggotaan',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'membershipStatus',
                  type: 'select',
                  required: true,
                  defaultValue: 'active',
                  label: 'Status Keanggotaan',
                  index: true,
                  options: [
                    { label: 'Aktif', value: 'active' },
                    { label: 'Tidak Aktif', value: 'inactive' },
                    { label: 'Keluar', value: 'resigned' },
                    { label: 'Dikeluarkan', value: 'expelled' },
                  ],
                },
                {
                  name: 'joinDate',
                  type: 'date',
                  required: true,
                  label: 'Tanggal Bergabung',
                  defaultValue: () => new Date().toISOString(),
                },
              ],
            },
            {
              name: 'resignDate',
              type: 'date',
              label: 'Tanggal Keluar',
              admin: {
                condition: (_data, siblingData) =>
                  siblingData?.membershipStatus === 'resigned' ||
                  siblingData?.membershipStatus === 'expelled',
              },
            },
          ],
        },
        {
          label: 'Dokumen',
          fields: [
            {
              name: 'idPhoto',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto KTP',
            },
            {
              name: 'selfiePhoto',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto Diri',
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
