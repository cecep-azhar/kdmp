import type { CollectionConfig } from 'payload'
import { checkRole } from '../../access/checkRole'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    group: 'Sistem',
    defaultColumns: ['name', 'email', 'roles'],
    description: 'Manajemen pengguna sistem Koperasi Merah Putih',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['super-admin', 'pengurus'], user)) return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => checkRole(['super-admin'], user),
    update: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['super-admin'], user)) return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => checkRole(['super-admin'], user),
    admin: ({ req: { user } }) => {
      if (!user) return false
      // Anggota tidak bisa akses admin panel
      return !user.roles?.every((role: string) => role === 'anggota')
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Lengkap',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['anggota'],
      label: 'Peran',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Pengurus', value: 'pengurus' },
        { label: 'Pengawas', value: 'pengawas' },
        { label: 'Staff Operasional', value: 'staff' },
        { label: 'Kasir', value: 'kasir' },
        { label: 'Anggota', value: 'anggota' },
      ],
      access: {
        // Hanya super admin yang bisa mengubah roles
        update: ({ req: { user } }) => checkRole(['super-admin'], user),
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Nomor Telepon',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Profil',
    },
  ],
  timestamps: true,
}
