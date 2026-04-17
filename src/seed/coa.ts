import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Seed data untuk Chart of Accounts (COA) standar koperasi
 * Jalankan: npx tsx src/seed/coa.ts
 */
const coaData = [
  // 1. ASET
  { code: '1-0000', name: 'ASET', type: 'asset', category: 'other', normalBalance: 'debit' },
  { code: '1-1000', name: 'Aset Lancar', type: 'asset', category: 'cash', normalBalance: 'debit', parentCode: '1-0000' },
  { code: '1-1001', name: 'Kas', type: 'asset', category: 'cash', normalBalance: 'debit', parentCode: '1-1000' },
  { code: '1-1002', name: 'Bank', type: 'asset', category: 'cash', normalBalance: 'debit', parentCode: '1-1000' },
  { code: '1-1003', name: 'Piutang Pinjaman Anggota', type: 'asset', category: 'receivable', normalBalance: 'debit', parentCode: '1-1000' },
  { code: '1-1004', name: 'Piutang Usaha', type: 'asset', category: 'receivable', normalBalance: 'debit', parentCode: '1-1000' },
  { code: '1-1005', name: 'Persediaan Barang Dagangan', type: 'asset', category: 'inventory', normalBalance: 'debit', parentCode: '1-1000' },
  { code: '1-1006', name: 'Perlengkapan', type: 'asset', category: 'inventory', normalBalance: 'debit', parentCode: '1-1000' },
  { code: '1-2000', name: 'Aset Tetap', type: 'asset', category: 'fixed-asset', normalBalance: 'debit', parentCode: '1-0000' },
  { code: '1-2001', name: 'Peralatan Kantor', type: 'asset', category: 'fixed-asset', normalBalance: 'debit', parentCode: '1-2000' },
  { code: '1-2002', name: 'Kendaraan', type: 'asset', category: 'fixed-asset', normalBalance: 'debit', parentCode: '1-2000' },
  { code: '1-2003', name: 'Bangunan', type: 'asset', category: 'fixed-asset', normalBalance: 'debit', parentCode: '1-2000' },
  { code: '1-2004', name: 'Tanah', type: 'asset', category: 'fixed-asset', normalBalance: 'debit', parentCode: '1-2000' },
  { code: '1-2099', name: 'Akumulasi Penyusutan', type: 'asset', category: 'fixed-asset', normalBalance: 'credit', parentCode: '1-2000' },

  // 2. KEWAJIBAN
  { code: '2-0000', name: 'KEWAJIBAN', type: 'liability', category: 'payable', normalBalance: 'credit' },
  { code: '2-1000', name: 'Simpanan Anggota', type: 'liability', category: 'member-savings', normalBalance: 'credit', parentCode: '2-0000' },
  { code: '2-1001', name: 'Simpanan Pokok', type: 'liability', category: 'member-savings', normalBalance: 'credit', parentCode: '2-1000' },
  { code: '2-1002', name: 'Simpanan Wajib', type: 'liability', category: 'member-savings', normalBalance: 'credit', parentCode: '2-1000' },
  { code: '2-1003', name: 'Simpanan Sukarela', type: 'liability', category: 'member-savings', normalBalance: 'credit', parentCode: '2-1000' },
  { code: '2-2000', name: 'Hutang Usaha', type: 'liability', category: 'payable', normalBalance: 'credit', parentCode: '2-0000' },
  { code: '2-2001', name: 'Hutang Bank', type: 'liability', category: 'payable', normalBalance: 'credit', parentCode: '2-0000' },
  { code: '2-2002', name: 'Dana Cadangan', type: 'liability', category: 'payable', normalBalance: 'credit', parentCode: '2-0000' },

  // 3. EKUITAS / MODAL
  { code: '3-0000', name: 'EKUITAS', type: 'equity', category: 'capital', normalBalance: 'credit' },
  { code: '3-1001', name: 'Modal Disetor', type: 'equity', category: 'capital', normalBalance: 'credit', parentCode: '3-0000' },
  { code: '3-1002', name: 'Modal Donasi', type: 'equity', category: 'capital', normalBalance: 'credit', parentCode: '3-0000' },
  { code: '3-1003', name: 'SHU Tahun Berjalan', type: 'equity', category: 'capital', normalBalance: 'credit', parentCode: '3-0000' },
  { code: '3-1004', name: 'SHU Tahun Lalu', type: 'equity', category: 'capital', normalBalance: 'credit', parentCode: '3-0000' },

  // 4. PENDAPATAN
  { code: '4-0000', name: 'PENDAPATAN', type: 'revenue', category: 'business-income', normalBalance: 'credit' },
  { code: '4-1001', name: 'Pendapatan Penjualan Barang', type: 'revenue', category: 'business-income', normalBalance: 'credit', parentCode: '4-0000' },
  { code: '4-1002', name: 'Pendapatan Jasa Simpan Pinjam', type: 'revenue', category: 'interest-income', normalBalance: 'credit', parentCode: '4-0000' },
  { code: '4-1003', name: 'Pendapatan Bunga Pinjaman', type: 'revenue', category: 'interest-income', normalBalance: 'credit', parentCode: '4-0000' },
  { code: '4-1004', name: 'Pendapatan Administrasi', type: 'revenue', category: 'business-income', normalBalance: 'credit', parentCode: '4-0000' },
  { code: '4-1005', name: 'Pendapatan Lain-lain', type: 'revenue', category: 'business-income', normalBalance: 'credit', parentCode: '4-0000' },

  // 5. BEBAN
  { code: '5-0000', name: 'BEBAN', type: 'expense', category: 'operational-expense', normalBalance: 'debit' },
  { code: '5-1001', name: 'Beban Gaji & Honorarium', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1002', name: 'Beban Sewa', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1003', name: 'Beban Listrik & Air', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1004', name: 'Beban Telepon & Internet', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1005', name: 'Beban ATK & Perlengkapan', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1006', name: 'Beban Penyusutan', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1007', name: 'Beban Administrasi Bank', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1008', name: 'Beban Transportasi', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1009', name: 'Beban Rapat & RAT', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1010', name: 'Beban Pendidikan & Pelatihan', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1011', name: 'Beban Bunga', type: 'expense', category: 'interest-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1012', name: 'HPP (Harga Pokok Penjualan)', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
  { code: '5-1099', name: 'Beban Lain-lain', type: 'expense', category: 'operational-expense', normalBalance: 'debit', parentCode: '5-0000' },
]

export async function seedCOA() {
  const payload = await getPayload({ config })

  console.log('🏦 Seeding Chart of Accounts (COA)...')

  // Cek apakah sudah ada data
  const existing = await payload.count({ collection: 'accounts' })
  if (existing.totalDocs > 0) {
    console.log('⚠️  COA sudah ada, skip seeding.')
    return
  }

  // Map parent codes ke IDs
  const codeToId: Record<string, string> = {}

  for (const account of coaData) {
    const { parentCode, ...data } = account as any
    const createData: any = { ...data, isActive: true }

    if (parentCode && codeToId[parentCode]) {
      createData.parentAccount = codeToId[parentCode]
    }

    const created = await payload.create({
      collection: 'accounts',
      data: createData,
    })

    codeToId[account.code] = String(created.id)
    console.log(`  ✅ ${account.code} - ${account.name}`)
  }

  console.log(`\n🎉 Seeded ${coaData.length} akun berhasil!`)
}

// Run if called directly
seedCOA()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed error:', err)
    process.exit(1)
  })
