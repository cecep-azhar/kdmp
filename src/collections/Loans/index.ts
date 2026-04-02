import type { CollectionConfig } from 'payload'
import { isSelfOrAdmin, isStaffOrAbove, isAdminOrPengurus } from '../../access'

/**
 * Menghitung jadwal angsuran pinjaman
 */
function generateInstallmentSchedule(
  principal: number,
  interestRate: number,
  tenorMonths: number,
  startDate: string,
) {
  const monthlyInterest = interestRate / 100 / 12
  const monthlyPrincipal = Math.round(principal / tenorMonths)
  const schedule: Array<{
    installmentNo: number
    dueDate: string
    principal: number
    interest: number
    total: number
    status: string
  }> = []

  let remainingPrincipal = principal
  const start = new Date(startDate)

  for (let i = 1; i <= tenorMonths; i++) {
    const interest = Math.round(remainingPrincipal * monthlyInterest)
    const principalPayment = i === tenorMonths ? remainingPrincipal : monthlyPrincipal
    remainingPrincipal -= principalPayment

    const dueDate = new Date(start)
    dueDate.setMonth(dueDate.getMonth() + i)

    schedule.push({
      installmentNo: i,
      dueDate: dueDate.toISOString(),
      principal: principalPayment,
      interest,
      total: principalPayment + interest,
      status: 'unpaid',
    })
  }

  return schedule
}

export const Loans: CollectionConfig = {
  slug: 'loans',
  admin: {
    useAsTitle: 'loanId',
    group: 'Simpan Pinjam',
    defaultColumns: ['loanId', 'member', 'amount', 'status', 'createdAt'],
    description: 'Manajemen pinjaman anggota',
  },
  access: {
    read: isSelfOrAdmin,
    create: isStaffOrAbove,
    update: isStaffOrAbove,
    delete: isAdminOrPengurus,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        // Auto-generate loan ID
        if (operation === 'create' && !data?.loanId) {
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          const count = await req.payload.count({ collection: 'loans' })
          const seq = String(count.totalDocs + 1).padStart(6, '0')
          data.loanId = `PIN-${dateStr}-${seq}`
        }

        // Generate installment schedule when status changes to 'active'
        if (
          data?.status === 'active' &&
          originalDoc?.status !== 'active' &&
          data?.amount &&
          data?.tenor
        ) {
          data.installmentSchedule = generateInstallmentSchedule(
            data.amount,
            data.interestRate || 0,
            data.tenor,
            data.disbursementDate || new Date().toISOString(),
          )
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req, previousDoc }) => {
        // Create ledger entry when loan is disbursed (status -> active)
        if (doc.status === 'active' && previousDoc?.status !== 'active') {
          try {
            await req.payload.create({
              collection: 'ledger',
              data: {
                date: new Date().toISOString(),
                description: `Pencairan Pinjaman - ${doc.loanId}`,
                entries: [
                  {
                    account: '1-1002', // Piutang Pinjaman
                    debit: doc.amount,
                    credit: 0,
                  },
                  {
                    account: '1-1001', // Kas
                    debit: 0,
                    credit: doc.amount,
                  },
                ],
                reference: `loans/${doc.id}`,
                createdByUser: req.user?.id,
              },
            })
          } catch (error) {
            console.error('Failed to create ledger entry for loan:', error)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'loanId',
      type: 'text',
      unique: true,
      label: 'No. Pinjaman',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      label: 'Anggota Peminjam',
      index: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Detail Pinjaman',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'amount',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: 'Jumlah Pinjaman (Rp)',
                },
                {
                  name: 'interestRate',
                  type: 'number',
                  required: true,
                  min: 0,
                  max: 100,
                  defaultValue: 12,
                  label: 'Suku Bunga (%/tahun)',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tenor',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 60,
                  label: 'Tenor (bulan)',
                },
                {
                  name: 'purpose',
                  type: 'select',
                  label: 'Tujuan Pinjaman',
                  options: [
                    { label: 'Produktif', value: 'productive' },
                    { label: 'Konsumtif', value: 'consumptive' },
                    { label: 'Pendidikan', value: 'education' },
                    { label: 'Kesehatan', value: 'health' },
                    { label: 'Lainnya', value: 'other' },
                  ],
                },
              ],
            },
            {
              name: 'purposeDescription',
              type: 'textarea',
              label: 'Keterangan Tujuan',
            },
          ],
        },
        {
          label: 'Status & Persetujuan',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'pending',
              label: 'Status',
              options: [
                { label: 'Menunggu Persetujuan', value: 'pending' },
                { label: 'Disetujui', value: 'approved' },
                { label: 'Aktif (Dicairkan)', value: 'active' },
                { label: 'Lunas', value: 'completed' },
                { label: 'Ditolak', value: 'rejected' },
                { label: 'Macet', value: 'defaulted' },
              ],
            },
            {
              name: 'approvedBy',
              type: 'relationship',
              relationTo: 'users',
              label: 'Disetujui Oleh',
            },
            {
              name: 'approvalDate',
              type: 'date',
              label: 'Tanggal Persetujuan',
            },
            {
              name: 'disbursementDate',
              type: 'date',
              label: 'Tanggal Pencairan',
            },
            {
              name: 'rejectionReason',
              type: 'textarea',
              label: 'Alasan Penolakan',
              admin: {
                condition: (_data, siblingData) => siblingData?.status === 'rejected',
              },
            },
          ],
        },
        {
          label: 'Jadwal Angsuran',
          fields: [
            {
              name: 'installmentSchedule',
              type: 'array',
              label: 'Jadwal Angsuran',
              admin: {
                description: 'Digenerate otomatis saat status pinjaman menjadi Aktif',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'installmentNo',
                      type: 'number',
                      label: 'Angsuran Ke-',
                      admin: { readOnly: true },
                    },
                    {
                      name: 'dueDate',
                      type: 'date',
                      label: 'Tanggal Jatuh Tempo',
                      admin: { readOnly: true },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'principal',
                      type: 'number',
                      label: 'Pokok (Rp)',
                      admin: { readOnly: true },
                    },
                    {
                      name: 'interest',
                      type: 'number',
                      label: 'Bunga (Rp)',
                      admin: { readOnly: true },
                    },
                    {
                      name: 'total',
                      type: 'number',
                      label: 'Total (Rp)',
                      admin: { readOnly: true },
                    },
                  ],
                },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'unpaid',
                  label: 'Status',
                  options: [
                    { label: 'Belum Dibayar', value: 'unpaid' },
                    { label: 'Dibayar', value: 'paid' },
                    { label: 'Terlambat', value: 'overdue' },
                  ],
                },
                {
                  name: 'paidDate',
                  type: 'date',
                  label: 'Tanggal Bayar',
                },
              ],
            },
            {
              name: 'totalPaid',
              type: 'number',
              label: 'Total Sudah Dibayar (Rp)',
              defaultValue: 0,
              admin: { readOnly: true },
            },
            {
              name: 'remainingBalance',
              type: 'number',
              label: 'Sisa Pinjaman (Rp)',
              admin: { readOnly: true },
            },
          ],
        },
        {
          label: 'Jaminan',
          fields: [
            {
              name: 'collateralType',
              type: 'select',
              label: 'Jenis Jaminan',
              options: [
                { label: 'Tidak Ada', value: 'none' },
                { label: 'Simpanan', value: 'savings' },
                { label: 'Sertifikat', value: 'certificate' },
                { label: 'BPKB', value: 'bpkb' },
                { label: 'Lainnya', value: 'other' },
              ],
            },
            {
              name: 'collateralDescription',
              type: 'textarea',
              label: 'Deskripsi Jaminan',
            },
            {
              name: 'collateralDocuments',
              type: 'array',
              label: 'Dokumen Jaminan',
              fields: [
                {
                  name: 'document',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'File Dokumen',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Keterangan',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
