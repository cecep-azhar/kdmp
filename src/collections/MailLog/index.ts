import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const MailLog: CollectionConfig = {
  slug: 'mail-log',
  labels: {
    singular: 'Surat',
    plural: 'Ekspedisi Surat',
  },
  admin: {
    useAsTitle: 'mailNumber',
    hidden: true,
    defaultColumns: ['date', 'mailType', 'mailNumber', 'senderOrRecipient'],
    description: 'Buku Agenda / Ekspedisi (Surat Masuk & Keluar)',
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
          name: 'date',
          type: 'date',
          required: true,
          label: 'Tanggal Ekspedisi',
          defaultValue: () => new Date().toISOString(),
        },
        {
          name: 'mailType',
          type: 'select',
          required: true,
          label: 'Jenis Surat',
          options: [
            { label: 'Surat Masuk', value: 'incoming' },
            { label: 'Surat Keluar', value: 'outgoing' },
          ],
        },
      ],
    },
    {
      name: 'mailNumber',
      type: 'text',
      required: true,
      label: 'Nomor Surat',
    },
    {
      name: 'senderOrRecipient',
      type: 'text',
      required: true,
      label: 'Asal Surat / Alamat Tujuan',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Perihal / Isi Ringkas',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'Scan / Softcopy Surat',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Keterangan Ekspedisi / Disposisi',
    },
  ],
  timestamps: true,
}
