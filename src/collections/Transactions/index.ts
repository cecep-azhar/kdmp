import type { CollectionConfig } from 'payload'
import { isKasirOrAbove, isAdminOrPengurus } from '../../access'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  labels: {
    singular: 'Transaksi',
    plural: 'Histori Transaksi',
  },
  admin: {
    useAsTitle: 'transactionId',
    group: 'POS',
    defaultColumns: ['transactionId', 'totalAmount', 'paymentMethod', 'createdAt'],
    description: 'Transaksi penjualan POS',
  },
  access: {
    read: isKasirOrAbove,
    create: isKasirOrAbove,
    update: isAdminOrPengurus,
    delete: isAdminOrPengurus,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-generate transaction ID
        if (operation === 'create' && !data?.transactionId) {
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          const count = await req.payload.count({ collection: 'transactions' })
          const seq = String(count.totalDocs + 1).padStart(6, '0')
          data.transactionId = `POS-${dateStr}-${seq}`
        }

        // Calculate totals
        if (data?.items && Array.isArray(data.items)) {
          let subTotal = 0
          for (const item of data.items) {
            item.subtotal = (item.quantity || 0) * (item.price || 0)
            subTotal += item.subtotal
          }
          data.subtotal = subTotal
          data.totalAmount = subTotal - (data.discount || 0)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // 1. Kurangi stok produk
          if (doc.items && Array.isArray(doc.items)) {
            for (const item of doc.items) {
              if (item.product) {
                try {
                  const product = await req.payload.findByID({
                    collection: 'products',
                    id: typeof item.product === 'string' ? item.product : item.product.id,
                  })
                  await req.payload.update({
                    collection: 'products',
                    id: product.id,
                    data: {
                      stock: Math.max(0, (product.stock || 0) - (item.quantity || 0)),
                    },
                  })
                } catch (error) {
                  console.error('Failed to update stock:', error)
                }
              }
            }
          }

          // 2. Jika pembayaran pakai simpanan sukarela, potong saldo
          if (doc.paymentMethod === 'savings-deduction' && doc.member) {
            try {
              await req.payload.create({
                collection: 'savings',
                data: {
                  member: typeof doc.member === 'string' ? doc.member : doc.member.id,
                  type: 'sukarela',
                  transactionType: 'withdrawal',
                  amount: doc.totalAmount,
                  status: 'completed',
                  method: 'pos-deduction',
                  notes: `Potongan POS - ${doc.transactionId}`,
                },
              })
            } catch (error) {
              console.error('Failed to deduct savings:', error)
            }
          }

          // 3. Catat ke Ledger
          try {
            const debitAccount = doc.paymentMethod === 'savings-deduction' ? '2-1003' : '1-1001'
            await req.payload.create({
              collection: 'ledger',
              data: {
                date: new Date().toISOString(),
                description: `Penjualan POS - ${doc.transactionId}`,
                entries: [
                  {
                    account: debitAccount,
                    debit: doc.totalAmount,
                    credit: 0,
                  },
                  {
                    account: '4-1001', // Pendapatan Penjualan
                    debit: 0,
                    credit: doc.totalAmount,
                  },
                ],
                reference: `transactions/${doc.id}`,
                journalType: 'cash-in',
                createdByUser: req.user?.id,
              },
            })
          } catch (error) {
            console.error('Failed to create ledger entry for transaction:', error)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'transactionId',
      type: 'text',
      unique: true,
      label: 'No. Transaksi',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Item Barang',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Produk',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
              min: 1,
              label: 'Jumlah',
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              min: 0,
              label: 'Harga Satuan (Rp)',
            },
            {
              name: 'subtotal',
              type: 'number',
              label: 'Subtotal (Rp)',
              admin: { readOnly: true },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          label: 'Subtotal (Rp)',
          admin: { readOnly: true },
        },
        {
          name: 'discount',
          type: 'number',
          defaultValue: 0,
          min: 0,
          label: 'Diskon (Rp)',
        },
        {
          name: 'totalAmount',
          type: 'number',
          label: 'Total (Rp)',
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'paymentMethod',
          type: 'select',
          required: true,
          defaultValue: 'cash',
          label: 'Metode Pembayaran',
          options: [
            { label: 'Tunai', value: 'cash' },
            { label: 'Transfer', value: 'transfer' },
            { label: 'QRIS', value: 'qris' },
            { label: 'Potong Simpanan Sukarela', value: 'savings-deduction' },
          ],
        },
        {
          name: 'member',
          type: 'relationship',
          relationTo: 'members',
          label: 'Anggota (untuk potong simpanan)',
          admin: {
            condition: (_data, siblingData) =>
              siblingData?.paymentMethod === 'savings-deduction',
          },
        },
      ],
    },
    {
      name: 'cashier',
      type: 'relationship',
      relationTo: 'users',
      label: 'Kasir',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Catatan',
    },
  ],
  timestamps: true,
}
