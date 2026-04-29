#!/usr/bin/env tsx
/**
 * KDMP Seeder CLI
 *
 * Load .env otomatis
 */
import 'dotenv/config'

/**
 *
 * Seed semua data ke database via command line.
 * Logika sama persis dengan GET /api/seed/all
 *
 * Usage:
 *   npx tsx run-seeder.ts              # Preview (dry-run)
 *   npx tsx run-seeder.ts --confirm    # Execute
 *   npx tsx run-seeder.ts --confirm --verbose  # Detail output
 */

import { getPayload } from 'payload'
import config from './src/payload.config'
import { coaData } from './src/seeder/coa'

// ─── CLI Args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const isDryRun = !args.includes('--confirm')
const isVerbose = args.includes('--verbose')
const isHelp = args.includes('--help')

function log(msg: string, type: 'info' | 'ok' | 'skip' | 'err' | 'warn' = 'info') {
  const icons = { info: '📦', ok: '✅', skip: '⏭️', err: '❌', warn: '⚠️' }
  const prefix = icons[type]
  console.log(`${prefix}  ${msg}`)
}

function verbose(msg: string) {
  if (isVerbose) console.log(`   ${msg}`)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function hasData(p: any, collection: string): Promise<boolean> {
  try {
    const result = await p.count({ collection })
    return result.totalDocs > 0
  } catch {
    return false
  }
}

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const dummyNames = [
  'Ahmad Suryawan', 'Budi Harsono', 'Candra Wijaya', 'Dedi Kurniawan', 'Eka Putra',
  'Fajar Nugroho', 'Gilang Pratama', 'Hendra Gunawan', 'Indra Lesmana', 'Joko Susanto',
  'Kusuma Wardani', 'Lukman Hakim', 'Muhammad Ridwan', 'Nurudin', 'Omar Hidayat',
  'Prabowo', 'Qomaruddin', 'Reza Pahlevi', 'Siti Aminah', 'Tari Mulyani',
  'Umar Syahid', 'Vina Panduwinata', 'Wawan Setiawan', 'Xaverius', 'Yayan Ruhian',
]

const adminMembers = [
  { fullName: 'H. Sudirman', nik: '3201012345678901', gender: 'male', birthPlace: 'Bandung', address: 'Jl. Koprasi No.1', occupation: 'Wiraswasta', membershipStatus: 'active' as const },
  { fullName: 'Dr. Wahyudi', nik: '3201019876543210', gender: 'male', birthPlace: 'Bandung', address: 'Jl. Koprasi No.2', occupation: 'Dokter', membershipStatus: 'active' as const },
  { fullName: 'Rina Kartika', nik: '3201015678901234', gender: 'female', birthPlace: 'Bandung', address: 'Jl. Koprasi No.3', occupation: 'Pendidik', membershipStatus: 'active' as const },
]

// ─── Seed Steps ──────────────────────────────────────────────────────────────

async function seedCOA(p: any) {
  const count = (await p.count({ collection: 'accounts' })).totalDocs
  if (count > 0) {
    verbose(`accounts: ${count} sudah ada`)
    return { count: 0, note: `already has ${count} accounts` }
  }
  if (isDryRun) return { count: coaData.length, note: 'would create all accounts' }
  for (const acc of coaData) {
    await p.create({ collection: 'accounts', data: { ...acc, isActive: true } })
  }
  return { count: coaData.length }
}

async function seedAdminMembers(p: any) {
  const count = (await p.count({ collection: 'members' })).totalDocs
  if (count > 0) {
    verbose(`members: ${count} sudah ada`)
    return { count: 0, note: `already has ${count} members` }
  }
  if (isDryRun) return { count: adminMembers.length, note: 'would create admin members' }
  for (const m of adminMembers) {
    await p.create({ collection: 'members', data: m })
  }
  return { count: adminMembers.length }
}

async function seedDummyMembers(p: any) {
  const count = (await p.count({ collection: 'members' })).totalDocs
  if (isDryRun) return { count: dummyNames.length, note: 'would create dummy members' }
  for (let i = 0; i < dummyNames.length; i++) {
    await p.create({
      collection: 'members',
      data: {
        fullName: dummyNames[i],
        nik: `3273${String(rnd(100000000000, 999999999999))}`,
        gender: rnd(0, 1) === 1 ? 'male' : 'female',
        birthPlace: 'Bandung',
        birthDate: new Date(Date.now() - rnd(20 * 365, 55 * 365) * 86400000).toISOString(),
        phone: `08${String(rnd(100000000, 999999999))}`,
        address: `Jl. Kopi Raya No.${i + 1}`,
        occupation: 'Penduduk',
        membershipStatus: 'active',
        joinDate: new Date().toISOString(),
      },
    })
  }
  return { count: dummyNames.length }
}

async function seedUsers(p: any) {
  const count = (await p.count({ collection: 'users' })).totalDocs
  if (count > 0) {
    verbose(`users: ${count} sudah ada`)
    return { count: 0, note: `already has ${count} users` }
  }
  if (isDryRun) return { count: dummyNames.length, note: 'would create users' }
  for (let i = 0; i < dummyNames.length; i++) {
    await p.create({
      collection: 'users',
      data: {
        name: dummyNames[i],
        email: `anggota${i + 1}@koperasi.id`,
        password: 'password123',
        roles: i < 5 ? ['pengurus'] : ['anggota'],
      },
    })
  }
  return { count: dummyNames.length }
}

async function seedOrg(p: any, collection: string, position: string, positionLabel: string) {
  const count = (await p.count({ collection })).totalDocs
  if (count > 0) {
    verbose(`${collection}: ${count} sudah ada`)
    return { count: 0, note: `already has ${count}` }
  }
  if (isDryRun) return { count: 1, note: `would create 1 ${positionLabel}` }

  const members = await p.find({ collection: 'members', limit: 1 })
  if (members.docs.length === 0) {
    verbose(`${collection}: tidak ada member, dilewati`)
    return { count: 0, note: 'no members found' }
  }

  await p.create({
    collection,
    data: {
      member: members.docs[0].id,
      position,
      periodStart: '2025-01-01T00:00:00.000Z',
      periodEnd: '2030-01-01T00:00:00.000Z',
      status: 'active',
    },
  })
  return { count: 1 }
}

async function seedEmployees(p: any) {
  const count = (await p.count({ collection: 'employees' })).totalDocs
  if (count > 0) {
    verbose('employees: already has data')
    return { count: 0 }
  }
  if (isDryRun) return { count: 1, note: 'would create 1 employee' }
  const members = await p.find({ collection: 'members', limit: 1 })
  if (members.docs.length === 0) return { count: 0, note: 'no members found' }
  await p.create({
    collection: 'employees',
    data: {
      member: members.docs[0].id,
      position: 'Manajer',
      hireDate: '2025-06-01T00:00:00.000Z',
      status: 'active',
    },
  })
  return { count: 1 }
}

async function seedGuestBook(p: any) {
  if (await hasData(p, 'guest-book')) {
    verbose('guest-book sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 2, note: 'would create 2 entries' }
  await p.create({ collection: 'guest-book', data: { date: new Date().toISOString(), guestName: 'Drs. Supriadi', title: 'Kepala Dinas Kopearasi', organization: 'Dinas Kopearasi Kab. Bandung', purpose: 'visit', followUpActions: 'Koordinasi program' } })
  await p.create({ collection: 'guest-book', data: { date: new Date().toISOString(), guestName: 'Prof. Dr. H. Mahmud', title: 'Akademisi', organization: 'Universitas Padjadjaran', purpose: 'coaching', followUpActions: 'Observasi sistem' } })
  return { count: 2 }
}

async function seedSuggestions(p: any) {
  if (await hasData(p, 'suggestions')) {
    verbose('suggestions sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 3, note: 'would create 3 entries' }
  const entries = [
    { category: 'member' as const, subject: 'Waktu Layanan Kasir Lebih Awal', submittedBy: 'H. Sudirman', content: 'Kasir sebaiknya buka lebih awal jam 07:30.', status: 'in_review' as const },
    { category: 'officer' as const, subject: 'Audit Eksternal Tahunan', submittedBy: 'Kepala Dinas Kopearasi', content: 'Kopearasi diharapkan menyewa auditor publik tahun ini.', status: 'resolved' as const },
    { category: 'external_officer' as const, subject: 'Sosialisasi Pajak', submittedBy: 'Petugas Pajak Kab. Bandung', content: 'Ada penyesuaian perhitungan pajak badan kopearasi.', status: 'in_review' as const },
  ]
  for (const e of entries) await p.create({ collection: 'suggestions', data: { ...e, date: new Date().toISOString() } })
  return { count: 3 }
}

async function seedMeetings(p: any) {
  if (await hasData(p, 'meetings')) {
    verbose('meetings sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 3, note: 'would create 3 meetings' }
  const entries = [
    { title: 'Rapat Evaluasi Triwulan 1', meetingType: 'supervisor' as const, status: 'conducted' as const, chairperson: 'Dr. Wahyudi', location: 'Kantor Koprasi' },
    { title: 'Rapat Persiapan RAT 2026', meetingType: 'board' as const, status: 'conducted' as const, chairperson: 'H. Sudirman', secretary: 'Rina Kartika', location: 'Aula Koprasi' },
    { title: 'Rapat Anggota Luar Biasa', meetingType: 'member' as const, status: 'conducted' as const, location: 'Aula Desa Merah Putih' },
  ]
  for (const e of entries) await p.create({ collection: 'meetings', data: { ...e, date: new Date().toISOString() } })
  return { count: 3 }
}

async function seedLogs(p: any) {
  if (await hasData(p, 'logs')) {
    verbose('logs sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 1 }
  await p.create({
    collection: 'logs',
    data: {
      date: new Date().toISOString(),
      title: 'Implementasi Sistem 16 Buku Administrasi',
      category: 'organizational' as const,
      importance: 'high' as const,
      content: {
        root: { type: 'root', format: '', indent: 0, version: 1, children: [{ type: 'paragraph', format: '', indent: 0, version: 1, children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Aplikasi SIKDMP sukses menerapkan 16 Buku Administrasi Koprasi sesuai standar pemerintah Indonesia.', type: 'text', version: 1 }] }] },
      },
      reportedBy: 'Super Admin',
    },
  })
  return { count: 1 }
}

async function seedLedger(p: any) {
  if (await hasData(p, 'ledger')) {
    verbose('ledger sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 1 }
  await p.create({
    collection: 'ledger',
    data: { date: new Date().toISOString(), description: 'Setoran Dana Bantuan Awal Koprasi', journalType: 'cash-in' as const, entries: [{ account: '1-1001', debit: 50000000, credit: 0 }, { account: '3-1001', debit: 0, credit: 50000000 }] },
  })
  return { count: 1 }
}

async function seedAssets(p: any) {
  if (await hasData(p, 'assets')) {
    verbose('assets sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 2 }
  await p.create({ collection: 'assets', data: { assetCode: 'INV-2026-001', name: 'Komputer Kasir SIKDM', category: 'electronics', acquisitionDate: '2026-04-03T00:00:00.000Z', acquisitionCost: 15000000, condition: 'good' } })
  await p.create({ collection: 'assets', data: { assetCode: 'INV-2026-002', name: 'Printer Laser', category: 'electronics', acquisitionDate: '2026-04-03T00:00:00.000Z', acquisitionCost: 3500000, condition: 'good' } })
  return { count: 2 }
}

async function seedMailLog(p: any) {
  if (await hasData(p, 'mail-log')) {
    verbose('mail-log sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 1 }
  await p.create({ collection: 'mail-log', data: { date: new Date().toISOString(), mailType: 'outgoing', mailNumber: '001/KDMP/IV/2026', senderOrRecipient: 'Seluruh Anggota', subject: 'Pemberitahuan Sistem 16 Buku Administrasi Baru', notes: 'Disposisi ke Ketua Umum' } })
  return { count: 1 }
}

async function seedProducts(p: any) {
  if (await hasData(p, 'products')) {
    verbose('products sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 3 }
  const products = [
    { sku: 'BRG-001', name: 'Beras Premium 5kg', price: 75000, stock: 100, category: 'groceries' as const },
    { sku: 'BRG-002', name: 'Minyak Goreng 2L', price: 28000, stock: 200, category: 'groceries' as const },
    { sku: 'BRG-003', name: 'Gula Pasir 1kg', price: 15000, stock: 150, category: 'groceries' as const },
  ]
  for (const prod of products) await p.create({ collection: 'products', data: prod })
  return { count: 3 }
}

async function seedNews(p: any) {
  if (await hasData(p, 'news')) {
    verbose('news sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 3 }
  const entries = [
    { title: 'Pelantikan Pengurus Baru Koprasi', slug: 'pelantikan-pengurus-2026', category: 'announcement' as const, status: 'published' as const },
    { title: 'Jadwal RAT Tahun Buku 2026', slug: 'jadwal-rat-2026', category: 'announcement' as const, status: 'published' as const },
    { title: 'Pelatihan Manajemen Keuangan Anggota', slug: 'pelatihan-keuangan-2026', category: 'education' as const, status: 'published' as const },
  ]
  for (let i = 0; i < entries.length; i++) {
    await p.create({
      collection: 'news',
      data: {
        ...entries[i],
        publishedAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
        content: {
          root: { type: 'root', format: '', indent: 0, version: 1, children: [{ type: 'paragraph', format: '', indent: 0, version: 1, children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: `Konten berita dummy ke-${i + 1} — dibuat oleh seeder CLI.`, type: 'text', version: 1 }] }] },
        },
      },
    })
  }
  return { count: 3 }
}

async function seedSavings(p: any) {
  if (await hasData(p, 'savings')) {
    verbose('savings sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 10, note: 'would create savings for members' }
  const members = await p.find({ collection: 'members', limit: 5 })
  let count = 0
  for (const member of members.docs) {
    await p.create({ collection: 'savings', data: { member: member.id, type: 'pokok', transactionType: 'deposit', amount: 500000, status: 'completed', method: 'cash' } })
    await p.create({ collection: 'savings', data: { member: member.id, type: 'sukarela', transactionType: 'deposit', amount: rnd(1, 10) * 50000, status: 'completed', method: 'cash' } })
    count += 2
  }
  return { count }
}

async function seedLoans(p: any) {
  if (await hasData(p, 'loans')) {
    verbose('loans sudah ada')
    return { count: 0 }
  }
  if (isDryRun) return { count: 3, note: 'would create 3 loans' }
  const members = await p.find({ collection: 'members', limit: 3 })
  const purposes = ['productive' as const, 'consumptive' as const, 'health' as const]
  for (let i = 0; i < members.docs.length; i++) {
    await p.create({
      collection: 'loans',
      data: { member: members.docs[i].id, amount: (i + 1) * 5000000, interestRate: 12, tenor: (i + 1) * 6, status: i < 2 ? 'approved' : 'pending', purpose: purposes[i % 3] },
    })
  }
  return { count: members.docs.length }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const steps = [
  { label: 'COA (Chart of Accounts)', fn: seedCOA },
  { label: 'Users (Dummy Login)', fn: seedUsers },
  { label: 'Members (Admin)', fn: seedAdminMembers },
  { label: 'Members (Dummy 25)', fn: seedDummyMembers },
  { label: 'Pengurus (Board Members)', fn: (p: any) => seedOrg(p, 'board-members', 'chairman', 'board member') },
  { label: 'Pengawas (Supervisors)', fn: (p: any) => seedOrg(p, 'supervisors', 'head', 'supervisor') },
  { label: 'Karyawan (Employees)', fn: seedEmployees },
  { label: 'Simpanan (Savings)', fn: seedSavings },
  { label: 'Pinjaman (Loans)', fn: seedLoans },
  { label: 'Buku Tamu (Guest Book)', fn: seedGuestBook },
  { label: 'Buku Saran (Suggestions)', fn: seedSuggestions },
  { label: 'Buku Rapat (Meetings)', fn: seedMeetings },
  { label: 'Buku Kejadian Penting (Logs)', fn: seedLogs },
  { label: 'Buku Kas (Ledger)', fn: seedLedger },
  { label: 'Buku Inventaris (Assets)', fn: seedAssets },
  { label: 'Buku Ekspedisi (Mail Log)', fn: seedMailLog },
  { label: 'Produk (Products)', fn: seedProducts },
  { label: 'Berita (News)', fn: seedNews },
]

async function main() {
  console.log('\n🟡  KDMP Seeder CLI  (v1.0.0)\n')

  if (isHelp) {
    console.log('Usage:')
    console.log('  npx tsx run-seeder.ts              # Preview (dry-run)')
    console.log('  npx tsx run-seeder.ts --confirm    # Execute')
    console.log('  npx tsx run-seeder.ts --verbose    # Detail output')
    console.log('  npx tsx run-seeder.ts --help       # Show this help\n')
    return
  }

  if (isDryRun) {
    console.log('🔵  Mode DRY-RUN — tidak ada data yang ditulis.\n')
  } else {
    console.log('🟢  Mode EXECUTE — data akan ditulis ke database.\n')
  }

  console.log('─'.repeat(50))
  console.log(`  ${steps.length} langkah seeding\n`)

  const start = Date.now()
  const payload = await getPayload({ config })

  const results: { label: string; count: number; note?: string }[] = []
  const errors: string[] = []

  for (const step of steps) {
    try {
      process.stdout.write(`  ▶  ${step.label}... `)
      const res = (await step.fn(payload)) as { count: number; note?: string }
      results.push({ label: step.label, ...res })
      if (res.count === 0) {
        console.log(`⏭️  skip${res.note ? ` (${res.note})` : ''}`)
      } else {
        console.log(`✅ +${res.count}${res.note ? ` (${res.note})` : ''}`)
      }
    } catch (err: any) {
      errors.push(`${step.label}: ${err.message}`)
      console.log(`❌ ${err.message}`)
    }
  }

  const elapsed = Date.now() - start
  console.log('\n' + '─'.repeat(50))

  const seeded = results.filter((r) => r.count > 0)
  const skipped = results.filter((r) => r.count === 0)

  if (isDryRun) {
    console.log(`\n🟡  DRY-RUN selesai dalam ${elapsed}ms`)
    console.log(`    Akan membuat: ${seeded.reduce((s, r) => s + r.count, 0)} record`)
    console.log(`    Akan skip:    ${skipped.length} koleksi (sudah terisi)\n`)
    console.log('  Jalankan dengan --confirm untuk mengeksekusi.\n')
  } else {
    if (errors.length === 0) {
      console.log(`\n✅  Seeding selesai dalam ${elapsed}ms`)
      console.log(`    Diciptakan: ${seeded.reduce((s, r) => s + r.count, 0)} record`)
      console.log(`    Dilewati:   ${skipped.length} koleksi\n`)
    } else {
      console.log(`\n⚠️  Seeding selesai dengan ${errors.length} error dalam ${elapsed}ms`)
      for (const e of errors) console.log(`    ❌ ${e}`)
      console.log('')
    }
  }

  process.exit(errors.length > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message)
  process.exit(1)
})
