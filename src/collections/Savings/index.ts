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
    group: 'Simpan Pinjam',
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
      async ({ data, operation, req, originalDoc }) => {
        // BUG FIX #4: Use timestamp-based ID to prevent race condition
        if (operation === 'create' && !data?.savingId) {
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          const timestamp = now.getTime().toString().slice(-6) // Last 6 digits
          const randomSuffix = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
          data.savingId = `SIM-${dateStr}-${timestamp}${randomSuffix}`
        }

        // BUG FIX #2: Prevent withdrawal of Simpanan Pokok (per UU No. 25 Tahun 1992)
        if (data?.transactionType === 'withdrawal' && data?.type === 'pokok') {
          throw new Error('Simpanan Pokok tidak dapat ditarik selama masih menjadi anggota')
        }

        // BUG FIX #3: Validate balance for withdrawals
        if (data?.transactionType === 'withdrawal' && data?.type !== 'pokok') {
          const memberId = data.member

          // Calculate total deposits and withdrawals for this member's savings type
          const existingSavings = await req.payload.find({
            collection: 'savings',
            where: {
              and: [
                { member: { equals: memberId } },
                { type: { equals: data.type } },
                { status: { equals: 'completed' } },
              ],
            },
            limit: 0,
          }) as { docs: Array<{ amount: number; transactionType: string }> }

          let currentBalance = 0
          existingSavings.docs.forEach((s) => {
            if (s.transactionType === 'deposit') {
              currentBalance += s.amount || 0
            } else {
              currentBalance -= s.amount || 0
            }
          })

          // For updates, add back the original amount
          if (operation === 'update' && originalDoc?.amount) {
            currentBalance += originalDoc.transactionType === 'deposit'
              ? originalDoc.amount
              : -originalDoc.amount
          }

          if ((data.amount || 0) > currentBalance) {
            throw new Error(`Saldo tidak mencukupi. Saldo saat ini: Rp ${currentBalance.toLocaleString('id-ID')}`)
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req, previousDoc }) => {
        // BUG FIX #8: Handle both create AND update operations for ledger entries
        // Only create ledger entry when status becomes 'completed'
        const statusChangedToCompleted = previousDoc?.status !== 'completed' && doc.status === 'completed'

        if (statusChangedToCompleted || (operation === 'create' && doc.status === 'completed')) {
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
