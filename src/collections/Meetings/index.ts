import type { CollectionConfig } from 'payload'
import { isAdminOrPengurus, isStaffOrAbove } from '../../access'

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  labels: {
    singular: 'Rapat',
    plural: 'Buku Notulen Rapat',
  },
  admin: {
    useAsTitle: 'title',
    hidden: true,
    defaultColumns: ['date', 'title', 'meetingType', 'status'],
    description: 'Buku Rapat (RAT) - Arsip notulensi rapat koperasi',
  },
  access: {
    read: isAdminOrPengurus,
    create: isStaffOrAbove,
    update: isAdminOrPengurus,
    delete: isAdminOrPengurus,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul Rapat',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'meetingType',
          type: 'select',
          required: true,
          label: 'Jenis Rapat',
          options: [
            { label: 'Rapat Anggota / RAT', value: 'member' },
            { label: 'Rapat Pengurus', value: 'board' },
            { label: 'Rapat Pengawas', value: 'supervisor' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'scheduled',
          label: 'Status',
          options: [
            { label: 'Dijadwalkan', value: 'scheduled' },
            { label: 'Dilaksanakan', value: 'conducted' },
            { label: 'Dibatalkan', value: 'cancelled' },
            { label: 'Ditunda', value: 'postponed' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Tanggal & Waktu',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Tempat',
        },
      ],
    },
    {
      name: 'agenda',
      type: 'richText',
      label: 'Agenda / Susunan Acara',
    },
    {
      name: 'attendees',
      type: 'array',
      label: 'Daftar Hadir',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nama',
            },
            {
              name: 'role',
              type: 'text',
              label: 'Jabatan/Peran',
            },
            {
              name: 'attendanceStatus',
              type: 'select',
              defaultValue: 'present',
              label: 'Status Kehadiran',
              options: [
                { label: 'Hadir', value: 'present' },
                { label: 'Izin', value: 'excused' },
                { label: 'Tidak Hadir', value: 'absent' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'minutes',
      type: 'richText',
      label: 'Notulensi / Risalah',
    },
    {
      name: 'decisions',
      type: 'array',
      label: 'Keputusan Rapat',
      fields: [
        {
          name: 'decision',
          type: 'textarea',
          required: true,
          label: 'Keputusan',
        },
        {
          name: 'responsible',
          type: 'text',
          label: 'Penanggung Jawab',
        },
        {
          name: 'deadline',
          type: 'date',
          label: 'Batas Waktu',
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          label: 'Status',
          options: [
            { label: 'Belum Dikerjakan', value: 'pending' },
            { label: 'Sedang Dikerjakan', value: 'in-progress' },
            { label: 'Selesai', value: 'done' },
          ],
        },
      ],
    },
    {
      name: 'documents',
      type: 'array',
      label: 'Dokumen Lampiran',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'File',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Keterangan',
        },
      ],
    },
    {
      name: 'chairperson',
      type: 'text',
      label: 'Pimpinan Rapat',
    },
    {
      name: 'secretary',
      type: 'text',
      label: 'Notulis',
    },
  ],
  timestamps: true,
}
