import type { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: {
    singular: 'Log Audit',
    plural: 'Log Audit',
  },
  admin: {
    useAsTitle: 'action',
    group: 'Pengaturan Sistem',
    defaultColumns: ['action', 'user', 'collection', 'recordId', 'createdAt'],
    description: 'Log audit untuk tracking perubahan data kritis',
  },
  access: {
    read: ({ req: { user } }) => {
      // Only super admin and pengurus can read audit logs
      return user?.roles?.includes('super-admin') || user?.roles?.includes('pengurus') ? true : false
    },
    create: () => true, // System creates logs automatically
    update: () => false, // No updates allowed
    delete: () => false, // No deletes allowed
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      label: 'Aksi',
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
        { label: 'Approval', value: 'approval' },
        { label: 'Rejection', value: 'rejection' },
      ],
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
      admin: {
        description: 'User yang melakukan aksi',
      },
    },
    {
      name: 'userName',
      type: 'text',
      label: 'Nama User',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'collection',
      type: 'text',
      label: 'Collection',
      admin: {
        description: 'Nama collection yang diubah',
      },
      index: true,
    },
    {
      name: 'recordId',
      type: 'text',
      label: 'Record ID',
      admin: {
        description: 'ID dokumen yang diubah',
      },
    },
    {
      name: 'changes',
      type: 'json',
      label: 'Perubahan',
      admin: {
        description: 'Detail perubahan data (JSON)',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP Address',
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'User Agent',
    },
    {
      name: 'description',
      type: 'text',
      label: 'Deskripsi',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'success',
      label: 'Status',
      options: [
        { label: 'Berhasil', value: 'success' },
        { label: 'Gagal', value: 'failed' },
      ],
    },
  ],
  timestamps: true,
}