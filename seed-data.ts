import { getPayload } from 'payload'
import config from './payload.config'

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('--- Seeding Data SIKDMP ---')

  // 1. Create Media (Placeholder)
  // Assuming 'media' collection exists and has some files or we just skip and use null for now.

  // 2. Create Members
  console.log('Seeding Members...')
  const member1 = await payload.create({
    collection: 'members',
    data: {
      fullName: 'Budi Santoso',
      memberId: 'ANG-001',
      nik: '3201010101010001',
      address: 'Jl. Raya Desa No. 1',
      phone: '081234567890',
      membershipStatus: 'active',
      joinDate: '2025-01-10T00:00:00.000Z',
    },
  })

  const member2 = await payload.create({
    collection: 'members',
    data: {
      fullName: 'Siti Aminah',
      memberId: 'ANG-002',
      nik: '3201010101010002',
      address: 'Jl. Melati No. 5',
      phone: '081298765432',
      membershipStatus: 'active',
      joinDate: '2025-02-15T00:00:00.000Z',
    },
  })

  // 3. Create Savings
  console.log('Seeding Savings...')
  await payload.create({
    collection: 'savings',
    data: {
      savingId: 'SIMP-001',
      member: member1.id,
      accountType: 'pokok',
      amount: 100000,
      transactionDate: new Date().toISOString(),
      transactionType: 'deposit',
      status: 'completed',
    },
  })

  await payload.create({
    collection: 'savings',
    data: {
      savingId: 'SIMP-002',
      member: member1.id,
      accountType: 'wajib',
      amount: 50000,
      transactionDate: new Date().toISOString(),
      transactionType: 'deposit',
      status: 'completed',
    },
  })

  // 4. Create Loans
  console.log('Seeding Loans...')
  await payload.create({
    collection: 'loans',
    data: {
      loanId: 'PIN-001',
      member: member1.id,
      amount: 5000000,
      interestRate: 12,
      tenor: 12,
      status: 'active',
      disbursementDate: '2025-03-01T00:00:00.000Z',
      purpose: 'productive',
      installmentSchedule: [
        { installmentNo: 1, dueDate: '2025-04-01T00:00:00.000Z', principal: 416667, interest: 50000, total: 466667, status: 'paid', paidDate: '2025-03-30T00:00:00.000Z' },
        { installmentNo: 2, dueDate: '2025-05-01T00:00:00.000Z', principal: 416667, interest: 50000, total: 466667, status: 'unpaid' },
      ],
    },
  })

  // 5. Create Products & Transactions
  console.log('Seeding POS...')
  const product1 = await payload.create({
    collection: 'products',
    data: {
      sku: 'BRG-001',
      name: 'Beras Premium 5kg',
      costPrice: 65000,
      price: 75000,
      stock: 50,
      category: 'groceries',
    },
  })

  await payload.create({
    collection: 'transactions',
    data: {
      transactionId: 'TRX-001',
      items: [
        { product: product1.id, quantity: 2, price: 75000, subtotal: 150000 }
      ],
      totalAmount: 150000,
      paymentMethod: 'cash',
      status: 'completed',
    },
  })

  // 6. Create News
  console.log('Seeding News...')
  await payload.create({
    collection: 'news',
    data: {
      title: 'RAT Koperasi Desa Merah Putih 2026',
      slug: 'rat-koperasi-2026',
      category: 'announcement',
      content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Rapat Anggota Tahunan akan segera dilaksanakan pada bulan Mei mendatang.',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  console.log('--- Seeding Completed! ---')
}

seed().catch(console.error)
