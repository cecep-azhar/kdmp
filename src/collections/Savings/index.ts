import type { CollectionConfig } from 'payload'
import { isSelfOrAdmin, isStaffOrAbove, isAdminOrPengurus } from '../../access'
import { COA, getSavingsAccountCode } from '../../constants/chart-of-accounts'

export const Savings: CollectionConfig = {
  slug: 'savings',
  labels: {
    singular: 'Simpanan',
    plural: 'Data Simpanan',
  },
  admin: {
    useAsTitle: 'savingId',
    hidden: true,
    defaultColumns: ['savingId', 'member', 'type', 'amount', 'createdAt'],
    description: 'Pencatatan simpanan anggota',
  },
  access: {
    read: isSelfOrAdmin,
    create: isStaffOrAbove,
    update: isStaffOrAbove,
    delete: isAdminOrPengurus,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-generate saving ID
        if (operation === 'create' && !data?.savingId) {
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          const count = await req.payload.count({ collection: 'savings' })
          const seq = String(count.totalDocs + 1).padStart(6, '0')
          data.savingId = `SIM-${dateStr}-${seq}`
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Setelah simpanan dibuat/status berubah, catat ke Ledger
        if (operation === 'create' && doc.status === 'completed') {
          try {
            const accountCode = getSavingsAccountCode(doc.type)

            // Determine entries based on transaction type
            // Deposit: Kas debit, Simpanan kredit (aset & kewajiban bertambah)
            // Withdrawal: Kas kredit, Simpanan debit (aset & kewajiban berkurang)
            const entries = doc.transactionType === 'deposit'
              ? [
                  { account: COA.KAS, debit: doc.amount, credit: 0 },
                  { account: accountCode, debit: 0, credit: doc.amount },
                ]
              : [
                  { account: COA.KAS, debit: 0, credit: doc.amount },
                  { account: accountCode, debit: doc.amount, credit: 0 },
                ]

            const transactionLabel = doc.transactionType === 'deposit' ? 'Setoran' : 'Penarikan'

            await req.payload.create({
              collection: 'ledger',
              data: {
                date: new Date().toISOString(),
                description: `${transactionLabel} Simpanan ${doc.type} - ${doc.savingId}`,
                entries,
                reference: `savings/${doc.id}`,
                journalType: doc.transactionType === 'deposit' ? 'cash-in' : 'cash-out',
                createdByUser: req.user?.id,
              },
            })
          } catch (error) {
            console.error('Failed to create ledger entry for saving:', error)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'savingId',
      type: 'text',
      unique: true,
      label: 'No. Transaksi',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      label: 'Anggota',
      index: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Jenis Simpanan',
          options: [
            { label: 'Simpanan Pokok', value: 'pokok' },
            { label: 'Simpanan Wajib', value: 'wajib' },
            { label: 'Simpanan Sukarela', value: 'sukarela' },
          ],
        },
        {
          name: 'transactionType',
          type: 'select',
          required: true,
          defaultValue: 'deposit',
          label: 'Tipe Transaksi',
          options: [
            { label: 'Setor', value: 'deposit' },
            { label: 'Tarik', value: 'withdrawal' },
          ],
        },
      ],
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Jumlah (Rp)',
      validate: (val: number | null | undefined) => {
        if (val !== null && val !== undefined && val < 0) {
          return 'Jumlah tidak boleh negatif'
        }
        return true
      },
    },
    {
      name: 'balance',
      type: 'number',
      label: 'Saldo Setelah Transaksi (Rp)',
      admin: {
        readOnly: true,
        description: 'Saldo dihitung otomatis',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      label: 'Status',
      index: true,
      options: [
        { label: 'Selesai', value: 'completed' },
        { label: 'Pending', value: 'pending' },
        { label: 'Dibatalkan', value: 'cancelled' },
      ],
    },
    {
      name: 'method',
      type: 'select',
      defaultValue: 'cash',
      label: 'Metode',
      options: [
        { label: 'Tunai', value: 'cash' },
        { label: 'Transfer', value: 'transfer' },
        { label: 'Auto Debet', value: 'autodebet' },
        { label: 'Potong POS', value: 'pos-deduction' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Catatan',
    },
    {
      name: 'processedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Diproses Oleh',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
