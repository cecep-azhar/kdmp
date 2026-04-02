import type { CollectionConfig } from 'payload'
import { checkRole } from '../../access/checkRole'
import { isStaffOrAbove, isAdminOrPengurus } from '../../access'

export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'fullName',
    group: 'Simpan Pinjam',
    defaultColumns: ['memberId', 'fullName', 'membershipStatus', 'joinDate'],
    description: 'Data anggota koperasi',
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
        if (operation === 'create' && !data?.memberId) {
          // Auto-generate member ID: KMP-YYYYMMDD-XXXX
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          const count = await req.payload.count({ collection: 'members' })
          const seq = String(count.totalDocs + 1).padStart(4, '0')
          data.memberId = `KMP-${dateStr}-${seq}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'memberId',
      type: 'text',
      required: true,
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
