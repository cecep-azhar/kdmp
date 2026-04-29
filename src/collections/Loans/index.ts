import type { CollectionConfig } from 'payload'
import { isSelfOrAdmin, isStaffOrAbove, isAdminOrPengurus } from '../../access'
import { COA } from '../../constants/chart-of-accounts'
import { createAuditLog, createNotification } from '../../utils/audit'

/**
 * Interface for installment schedule entries
 */
interface Installment {
  installmentNo: number
  dueDate: string
  principal: number
  interest: number
  total: number
  status: 'unpaid' | 'paid' | 'overdue'
  paidDate?: string
}

/**
 * Interface for loan data used in hooks
 */
interface LoanHookData {
  amount?: number
  interestRate?: number
  tenor?: number
  status?: string
  disbursementDate?: string
  installmentSchedule?: Installment[]
  totalPaid?: number
  remainingBalance?: number
}

/**
 * Interface for loan document in hooks
 */
interface LoanHookDoc extends LoanHookData {
  id: string | number
  loanId?: string
}

/**
 * Menghitung jadwal angsuran pinjaman
 */
function generateInstallmentSchedule(
  principal: number,
  interestRate: number,
  tenorMonths: number,
  startDate: string,
): Installment[] {
  const monthlyInterest = interestRate / 100 / 12
  const monthlyPrincipal = Math.round(principal / tenorMonths)
  const schedule: Installment[] = []

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
  labels: {
    singular: 'Pinjaman',
    plural: 'Data Pinjaman',
  },
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
        // BUG FIX #4: Use timestamp-based ID to prevent race condition
        if (operation === 'create' && !data?.loanId) {
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          const timestamp = now.getTime().toString().slice(-6) // Last 6 digits of timestamp
          const randomSuffix = Math.floor(Math.random() * 999).toString().padStart(3, '0')
          data.loanId = `PIN-${dateStr}-${timestamp}${randomSuffix}`
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

        // Recalculate totals if installment schedule exists
        if (data?.installmentSchedule && Array.isArray(data.installmentSchedule)) {
          const paidInstallments = data.installmentSchedule.filter((i: Installment) => i.status === 'paid')
          const totalPaid = paidInstallments.reduce((sum: number, i: Installment) => sum + (i.total || 0), 0)
          data.totalPaid = totalPaid

          // Calculate remaining balance
          const totalWithInterest = (data.amount || 0) * (1 + (data.interestRate || 0) / 100)
          data.remainingBalance = totalWithInterest - totalPaid

          // If balance is 0 or less, mark as completed
          if (data.remainingBalance <= 0 && data.status === 'active') {
            data.status = 'completed'
          }
        }

        // FITUR #8: Calculate late penalty for overdue installments
        if (data?.installmentSchedule && Array.isArray(data.installmentSchedule)) {
          // Get late penalty rate from settings (default 0.5% per day)
          let latePenaltyRate = 0.005 // 0.5%
          try {
            const settings = await req.payload.findGlobal({ slug: 'settings' }) as any
            if (settings?.loanSettings?.latePenaltyPerDay) {
              latePenaltyRate = (settings.loanSettings.latePenaltyPerDay || 0.5) / 100
            }
          } catch (e) {
            // Use default
          }

          const today = new Date()
          let totalPenalty = 0

          data.installmentSchedule = data.installmentSchedule.map((inst: Installment) => {
            if (inst.status === 'unpaid' || inst.status === 'overdue') {
              const dueDate = new Date(inst.dueDate)
              if (dueDate < today) {
                const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
                if (daysOverdue > 0) {
                  inst.status = 'overdue'
                  const penalty = Math.round(inst.total * latePenaltyRate * daysOverdue)
                  totalPenalty += penalty
                }
              }
            }
            return inst
          })
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req, previousDoc }) => {
        // Create audit log for loan creation
        if (operation === 'create') {
          await createAuditLog({
            action: 'create',
            userId: req.user?.id,
            userName: req.user?.name,
            collection: 'loans',
            recordId: doc.loanId,
            changes: {
              amount: doc.amount,
              tenor: doc.tenor,
              interestRate: doc.interestRate,
              member: doc.member,
            },
            description: `Pengajuan pinjaman baru ${doc.loanId}`,
            status: 'success',
          })

          // Notify member about loan submission
          await createNotification(req.payload, {
            title: 'Pengajuan Pinjaman Submitted',
            message: `Pengajuan pinjaman Anda sebesar Rp ${doc.amount?.toLocaleString('id-ID')} sedang menunggu persetujuan.`,
            type: 'loan',
            recipientId: typeof doc.member === 'object' ? (doc.member as { id?: number | string })?.id : doc.member,
            relatedId: String(doc.id),
            relatedType: 'loan',
          })
        }

        // Handle status changes
        if (doc.status !== previousDoc?.status) {
          // FITUR #7: Approval workflow - notification on status change
          const memberId = typeof doc.member === 'object' ? (doc.member as { id?: number | string })?.id : doc.member

          switch (doc.status) {
            case 'approved':
              await createAuditLog({
                action: 'approval',
                userId: req.user?.id,
                userName: req.user?.name,
                collection: 'loans',
                recordId: doc.loanId,
                description: `Pinjaman ${doc.loanId} disetujui`,
              })
              await createNotification(req.payload, {
                title: 'Pinjaman Disetujui',
                message: `Pengajuan pinjaman ${doc.loanId} telah disetujui. Menunggu pencairan.`,
                type: 'loan',
                recipientId: memberId,
                relatedId: String(doc.id),
                relatedType: 'loan',
                priority: 'high',
              })
              break

            case 'rejected':
              await createAuditLog({
                action: 'rejection',
                userId: req.user?.id,
                userName: req.user?.name,
                collection: 'loans',
                recordId: doc.loanId,
                description: `Pinjaman ${doc.loanId} ditolak`,
              })
              await createNotification(req.payload, {
                title: 'Pinjaman Ditolak',
                message: `Pengajuan pinjaman ${doc.loanId} ditolak. ${doc.rejectionReason || ''}`,
                type: 'loan',
                recipientId: memberId,
                relatedId: String(doc.id),
                relatedType: 'loan',
              })
              break

            case 'active':
              await createNotification(req.payload, {
                title: 'Pinjaman dicairkan',
                message: `Pinjaman ${doc.loanId} telah dicairkan. Silakan cek jadwal angsuran.`,
                type: 'loan',
                recipientId: memberId,
                relatedId: String(doc.id),
                relatedType: 'loan',
                priority: 'high',
              })
              break

            case 'completed':
              await createNotification(req.payload, {
                title: 'Pinjaman Lunas',
                message: `Selamat! Pinjaman ${doc.loanId} telah lunas. Terima kasih atas kepercayaan Anda.`,
                type: 'loan',
                recipientId: memberId,
                relatedId: String(doc.id),
                relatedType: 'loan',
                priority: 'high',
              })
              break
          }
        }

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
                    account: COA.PIUTANG_PINJAMAN, // Piutang Pinjaman
                    debit: doc.amount,
                    credit: 0,
                  },
                  {
                    account: COA.KAS, // Kas
                    debit: 0,
                    credit: doc.amount,
                  },
                ],
                reference: `loans/${doc.id}`,
                createdByUser: req.user?.id,
              },
            })
          } catch (error) {
            console.error('Failed to create ledger entry for loan disbursement:', error)
          }
        }

        // Create ledger entry when an installment is marked as paid
        if (doc.installmentSchedule && previousDoc?.installmentSchedule) {
          const currentSchedule = doc.installmentSchedule as Installment[]
          const previousSchedule = previousDoc.installmentSchedule as Installment[]
          const newlyPaid = currentSchedule.filter((curr: Installment, idx: number) => {
            const prev = previousSchedule[idx]
            return curr.status === 'paid' && prev?.status !== 'paid'
          })

          for (const inst of newlyPaid) {
            try {
              await req.payload.create({
                collection: 'ledger',
                data: {
                  date: inst.paidDate || new Date().toISOString(),
                  description: `Angsuran #${inst.installmentNo} - ${doc.loanId} (${doc.member.fullName || 'Anggota'})`,
                  entries: [
                    {
                      account: COA.KAS, // Kas
                      debit: inst.total,
                      credit: 0,
                    },
                    {
                      account: COA.PIUTANG_PINJAMAN, // Piutang Pinjaman Anggota
                      debit: 0,
                      credit: inst.principal,
                    },
                    {
                      account: COA.PENDAPATAN_BUNGA_PINJAMAN, // Pendapatan Bunga Pinjaman
                      debit: 0,
                      credit: inst.interest,
                    }
                  ],
                  reference: `loans/${doc.id}`,
                  journalType: 'cash-in',
                  createdByUser: req.user?.id,
                },
              })
            } catch (error) {
              console.error('Failed to create ledger entry for installment payment:', error)
            }
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
              index: true,
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
