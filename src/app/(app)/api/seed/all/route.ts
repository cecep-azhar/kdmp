/**
 * Seeder: All-in-One Seed Everything
 * Endpoint: GET /api/seed/all
 *
 * Seed semua data sekaligus:
 * - COA (Chart of Accounts) - 40+ akun
 * - 16 Buku Administrasi Koprasi
 * - Data dummy (25 anggota + users + news + savings)
 * - Organisasi (pengurus, pengawas, karyawan)
 *
 * VALIDASI:
 * - Cek ALLOW_SEED di production
 * - Konfirmasi wajib via ?confirm=true
 * - Skip koleksi yang sudah terisi
 * - Return detail hasil seeding
 */

import { getPayload } from 'payload'
import config from '../../../../../payload.config'
import { NextResponse } from 'next/server'
import { coaData } from '../../../../../seeder/coa'

export const dynamic = 'force-dynamic'

// ─── Tipe ────────────────────────────────────────────────────────────────────

interface SeedStep {
  name: string
  fn: () => Promise<{ count: number; note?: string }>
}

interface SeedResult {
  success: boolean
  message: string
  version: string
  skipped: string[]
  seeded: Record<string, number | string>
  errors: string[]
  duration_ms: number
}

// ─── Helper: check koleksi sudah terisi ─────────────────────────────────────

async function collectionHasData(p: any, collection: string): Promise<boolean> {
  try {
    const result = await p.count({ collection })
    return result.totalDocs > 0
  } catch {
    return false
  }
}

// ─── Seed: COA ───────────────────────────────────────────────────────────────

async function seedCOA(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'accounts')
  if (hasData) return { count: 0, note: 'already seeded' }

  const created = new Set<string>()
  for (const acc of coaData) {
    // cek duplikat berdasarkan code
    const exists = await p.find({
      collection: 'accounts',
      where: { code: { equals: acc.code } },
      limit: 1,
    })
    if (exists.docs.length === 0) {
      await p.create({ collection: 'accounts', data: { ...acc, isActive: true } })
      created.add(acc.code)
    }
  }
  return { count: created.size, note: created.size < coaData.length ? `partial (${created.size}/${coaData.length})` : 'all accounts created' }
}

// ─── Seed: Members (admin) ───────────────────────────────────────────────────

const adminMembers = [
  { fullName: 'H. Sudirman', nik: '3201012345678901', gender: 'male', birthPlace: 'Bandung', address: 'Jl. Koprasi No.1', occupation: 'Wiraswasta', membershipStatus: 'active' as const },
  { fullName: 'Dr. Wahyudi', nik: '3201019876543210', gender: 'male', birthPlace: 'Bandung', address: 'Jl. Koprasi No.2', occupation: 'Dokter', membershipStatus: 'active' as const },
  { fullName: 'Rina Kartika', nik: '3201015678901234', gender: 'female', birthPlace: 'Bandung', address: 'Jl. Koprasi No.3', occupation: 'Pendidik', membershipStatus: 'active' as const },
]

async function seedAdminMembers(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'members')
  if (hasData) return { count: 0, note: 'already seeded' }

  const ids: string[] = []
  for (const m of adminMembers) {
    const created = await p.create({ collection: 'members', data: m })
    ids.push(created.id)
  }
  return { count: ids.length, note: `ids: ${ids.join(', ')}` }
}

// ─── Seed: Users (dummy) ──────────────────────────────────────────────────────

const dummyNames = [
  'Ahmad Suryawan', 'Budi Harsono', 'Candra Wijaya', 'Dedi Kurniawan', 'Eka Putra',
  'Fajar Nugroho', 'Gilang Pratama', 'Hendra Gunawan', 'Indra Lesmana', 'Joko Susanto',
  'Kusuma Wardani', 'Lukman Hakim', 'Muhammad Ridwan', 'Nurudin', 'Omar Hidayat',
  'Prabowo', 'Qomaruddin', 'Reza Pahlevi', 'Siti Aminah', 'Tari Mulyani',
  'Umar Syahid', 'Vina Panduwinata', 'Wawan Setiawan', 'Xaverius', 'Yayan Ruhian',
]

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

async function seedDummyUsers(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'users')
  if (hasData) return { count: 0, note: 'already seeded' }

  for (let i = 0; i < dummyNames.length; i++) {
    const email = `anggota${i + 1}@koperasi.id`
    // cek duplikat email
    const exists = await p.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
    if (exists.docs.length > 0) continue

    await p.create({
      collection: 'users',
      data: {
        name: dummyNames[i],
        email,
        password: 'password123',
        roles: i < 5 ? ['pengurus'] : ['anggota'],
      },
    })
  }
  return { count: dummyNames.length, note: 'users + members created' }
}

// ─── Seed: Dummy Members ─────────────────────────────────────────────────────

async function seedDummyMembers(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'members')
  if (hasData) return { count: 0, note: 'already seeded (checked above)' }

  // Seed admin members first
  const adminIds = await seedAdminMembers(p)

  // Then seed dummy members
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
  return { count: dummyNames.length + adminMembers.length, note: `${adminMembers.length} admin + ${dummyNames.length} dummy` }
}

// ─── Seed: Board Members ──────────────────────────────────────────────────────

async function seedBoardMembers(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'board-members')
  if (hasData) return { count: 0, note: 'already seeded' }

  const members = await p.find({ collection: 'members', limit: 3 })
  if (members.docs.length === 0) return { count: 0, note: 'no members found' }

  const positions = [
    { position: 'chairman' as const, periodEnd: '2030-01-01' },
    { position: 'vice_chairman' as const, periodEnd: '2030-01-01' },
    { position: 'secretary' as const, periodEnd: '2030-01-01' },
    { position: 'treasurer' as const, periodEnd: '2030-01-01' },
    { position: 'member' as const, periodEnd: '2030-01-01' },
  ]

  let created = 0
  for (let i = 0; i < Math.min(members.docs.length, positions.length); i++) {
    await p.create({
      collection: 'board-members',
      data: {
        member: members.docs[i].id,
        position: positions[i].position,
        periodStart: '2025-01-01T00:00:00.000Z',
        periodEnd: `${positions[i].periodEnd}T00:00:00.000Z`,
        status: 'active',
      },
    })
    created++
  }
  return { count: created }
}

// ─── Seed: Supervisors ───────────────────────────────────────────────────────

async function seedSupervisors(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'supervisors')
  if (hasData) return { count: 0, note: 'already seeded' }

  const members = await p.find({ collection: 'members', limit: 3, page: 2 })
  if (members.docs.length === 0) return { count: 0, note: 'no members found' }

  const positions = ['head' as const, 'member' as const, 'member' as const]
  let created = 0
  for (let i = 0; i < Math.min(members.docs.length, 3); i++) {
    await p.create({
      collection: 'supervisors',
      data: {
        member: members.docs[i].id,
        position: positions[i],
        periodStart: '2025-01-01T00:00:00.000Z',
        periodEnd: '2030-01-01T00:00:00.000Z',
        status: 'active',
      },
    })
    created++
  }
  return { count: created }
}

// ─── Seed: Employees ─────────────────────────────────────────────────────────

async function seedEmployees(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'employees')
  if (hasData) return { count: 0, note: 'already seeded' }

  const members = await p.find({ collection: 'members', limit: 3, page: 3 })
  const roles = [
    { position: 'manager' as const, department: 'Umum' },
    { position: 'teller' as const, department: 'Simpan Pinjam' },
    { position: 'admin' as const, department: 'Keuangan' },
  ]

  let created = 0
  for (let i = 0; i < Math.min(members.docs.length, 3); i++) {
    await p.create({
      collection: 'employees',
      data: {
        member: members.docs[i].id,
        position: roles[i].position,
        department: roles[i].department,
        joinDate: '2025-06-01T00:00:00.000Z',
        employmentStatus: 'contract',
        status: 'active',
      },
    })
    created++
  }
  return { count: created }
}

// ─── Seed: Savings ────────────────────────────────────────────────────────────

async function seedSavings(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'savings')
  if (hasData) return { count: 0, note: 'already seeded' }

  const members = await p.find({ collection: 'members', limit: 10 })
  if (members.docs.length === 0) return { count: 0, note: 'no members found' }

  let created = 0
  for (const member of members.docs) {
    await p.create({
      collection: 'savings',
      data: {
        member: member.id,
        type: 'pokok',
        transactionType: 'deposit',
        amount: 500000,
        status: 'completed',
        method: 'cash',
      },
    })
    created++
    // Sukarela
    await p.create({
      collection: 'savings',
      data: {
        member: member.id,
        type: 'sukarela',
        transactionType: 'deposit',
        amount: rnd(1, 10) * 50000,
        status: 'completed',
        method: 'cash',
      },
    })
    created++
  }
  return { count: created }
}

// ─── Seed: Loans ──────────────────────────────────────────────────────────────

async function seedLoans(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'loans')
  if (hasData) return { count: 0, note: 'already seeded' }

  const members = await p.find({ collection: 'members', limit: 5 })
  if (members.docs.length === 0) return { count: 0, note: 'no members found' }

  const purposes = ['productive' as const, 'consumption' as const, 'emergency' as const]
  let created = 0
  for (let i = 0; i < members.docs.length; i++) {
    await p.create({
      collection: 'loans',
      data: {
        member: members.docs[i].id,
        amount: (i + 1) * 5000000,
        interestRate: 12,
        tenor: (i + 1) * 6,
        status: i < 2 ? 'approved' : 'pending',
        purpose: purposes[i % 3],
      },
    })
    created++
  }
  return { count: created }
}

// ─── Seed: Guest Book ─────────────────────────────────────────────────────────

async function seedGuestBook(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'guest-book')
  if (hasData) return { count: 0, note: 'already seeded' }

  const entries = [
    { guestName: 'Drs. Supriadi', title: 'Kepala Dinas Kopearasi', organization: 'Dinas Kopearasi Kab. Bandung', purpose: 'visit' as const, followUpActions: 'Koordinasi program tahunan' },
    { guestName: 'Prof. Dr. H. Mahmud', title: 'Akademisi', organization: 'Universitas Padjadjaran', purpose: 'research' as const, followUpActions: 'Observasi sistem koprasi' },
  ]

  for (const entry of entries) {
    await p.create({ collection: 'guest-book', data: { ...entry, date: new Date().toISOString() } })
  }
  return { count: entries.length }
}

// ─── Seed: Suggestions ────────────────────────────────────────────────────────

async function seedSuggestions(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'suggestions')
  if (hasData) return { count: 0, note: 'already seeded' }

  const entries = [
    { category: 'member' as const, subject: 'Waktu Layanan Kasir Lebih Awal', submittedBy: 'H. Sudirman', content: 'Kasir sebaiknya buka lebih awal jam 07:30 untuk kenyamanan anggota.', status: 'in_review' as const },
    { category: 'officer' as const, subject: 'Audit Eksternal Tahunan', submittedBy: 'Kepala Dinas Kopearasi', content: 'Kopearasi diharapkan menyewa auditor publik tahun ini.', status: 'resolved' as const },
    { category: 'external_officer' as const, subject: 'Sosialisasi Pajak', submittedBy: 'Petugas Pajak Kab. Bandung', content: 'Ada penyesuaian perhitungan pajak badan kopearasi.', status: 'in_review' as const },
  ]

  for (const entry of entries) {
    await p.create({ collection: 'suggestions', data: { ...entry, date: new Date().toISOString() } })
  }
  return { count: entries.length }
}

// ─── Seed: Meetings ───────────────────────────────────────────────────────────

async function seedMeetings(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'meetings')
  if (hasData) return { count: 0, note: 'already seeded' }

  const entries = [
    { title: 'Rapat Evaluasi Triwulan 1', meetingType: 'supervisor' as const, status: 'conducted' as const, chairperson: 'Dr. Wahyudi', location: 'Kantor Koprasi' },
    { title: 'Rapat Persiapan RAT 2026', meetingType: 'board' as const, status: 'conducted' as const, chairperson: 'H. Sudirman', secretary: 'Rina Kartika', location: 'Aula Koprasi' },
    { title: 'Rapat Anggota Luar Biasa (RALB)', meetingType: 'member' as const, status: 'conducted' as const, location: 'Aula Desa Merah Putih' },
  ]

  for (const entry of entries) {
    await p.create({ collection: 'meetings', data: { ...entry, date: new Date().toISOString() } })
  }
  return { count: entries.length }
}

// ─── Seed: Logs ──────────────────────────────────────────────────────────────

async function seedLogs(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'logs')
  if (hasData) return { count: 0, note: 'already seeded' }

  await p.create({
    collection: 'logs',
    data: {
      date: new Date().toISOString(),
      title: 'Implementasi Sistem 16 Buku Administrasi',
      category: 'organizational' as const,
      importance: 'high' as const,
      content: 'Aplikasi SIKDM sukses menerapkan format standar 16 Buku Administrasi Koprasi Indonesia.',
      reportedBy: 'Super Admin',
    },
  })
  return { count: 1 }
}

// ─── Seed: Ledger ─────────────────────────────────────────────────────────────

async function seedLedger(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'ledger')
  if (hasData) return { count: 0, note: 'already seeded' }

  await p.create({
    collection: 'ledger',
    data: {
      date: new Date().toISOString(),
      description: 'Setoran Dana Bantuan Awal Koprasi',
      journalType: 'cash-in' as const,
      entries: [
        { account: '1-1001', debit: 50000000, credit: 0 },
        { account: '3-1001', debit: 0, credit: 50000000 },
      ],
    },
  })
  return { count: 1 }
}

// ─── Seed: Assets ─────────────────────────────────────────────────────────────

async function seedAssets(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'assets')
  if (hasData) return { count: 0, note: 'already seeded' }

  const entries = [
    { assetCode: 'INV-2026-001', name: 'Komputer Kasir SIKDM', category: 'electronics' as const, acquisitionCost: 15000000, condition: 'good' as const },
    { assetCode: 'INV-2026-002', name: 'Printer Laser', category: 'electronics' as const, acquisitionCost: 3500000, condition: 'good' as const },
  ]

  for (const entry of entries) {
    await p.create({
      collection: 'assets',
      data: { ...entry, acquisitionDate: '2026-04-03T00:00:00.000Z' },
    })
  }
  return { count: entries.length }
}

// ─── Seed: Mail Log ───────────────────────────────────────────────────────────

async function seedMailLog(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'mail-log')
  if (hasData) return { count: 0, note: 'already seeded' }

  await p.create({
    collection: 'mail-log',
    data: {
      date: new Date().toISOString(),
      mailType: 'outgoing' as const,
      mailNumber: '001/KDMP/IV/2026',
      senderOrRecipient: 'Seluruh Anggota',
      subject: 'Pemberitahuan Sistem 16 Buku Administrasi Baru',
      notes: 'Disposisi ke Ketua Umum untuk tindak lanjut',
    },
  })
  return { count: 1 }
}

// ─── Seed: Products ──────────────────────────────────────────────────────────

async function seedProducts(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'products')
  if (hasData) return { count: 0, note: 'already seeded' }

  const products = [
    { sku: 'BRG-001', name: 'Beras Premium 5kg', price: 75000, stock: 100, category: 'groceries' as const },
    { sku: 'BRG-002', name: 'Minyak Goreng 2L', price: 28000, stock: 200, category: 'groceries' as const },
    { sku: 'BRG-003', name: 'Gula Pasir 1kg', price: 15000, stock: 150, category: 'groceries' as const },
  ]

  for (const prod of products) {
    await p.create({ collection: 'products', data: prod })
  }
  return { count: products.length }
}

// ─── Seed: News ───────────────────────────────────────────────────────────────

async function seedNews(p: any): Promise<{ count: number; note?: string }> {
  const hasData = await collectionHasData(p, 'news')
  if (hasData) return { count: 0, note: 'already seeded' }

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
          root: {
            type: 'root', format: '', indent: 0, version: 1,
            children: [{
              type: 'paragraph', format: '', indent: 0, version: 1,
              children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: `Konten berita dummy ke-${i + 1} — dibuat otomatis oleh seeder untuk testing.`, type: 'text', version: 1 }],
            }],
          },
        },
      },
    })
  }
  return { count: entries.length }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const start = Date.now()
  const url = new URL(request.url)

  // ── Validasi 1: Production environment check ──
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
    return NextResponse.json({
      success: false,
      message: 'Seed dinonaktifkan di production. Set ALLOW_SEED=true untuk mengaktifkan.',
      version: '1.0.0',
    }, { status: 403 })
  }

  // ── Validasi 2: Konfirmasi required ──
  const confirm = url.searchParams.get('confirm')
  if (!confirm || (confirm !== 'true' && confirm !== '1')) {
    return NextResponse.json({
      success: false,
      message: 'Konfirmasi diperlukan. Gunakan: /api/seed/all?confirm=true',
      warning: 'Endpoint ini akan seeding data ke database.',
      version: '1.0.0',
    }, { status: 400 })
  }

  // ── Validasi 3: API secret (opsional, untuk keamanan ekstra) ──
  const secret = url.searchParams.get('secret')
  const allowedSecrets = [process.env.SEED_SECRET, 'dev-seed-secret'].filter(Boolean)
  if (allowedSecrets.length > 0 && !allowedSecrets.includes(secret ?? '')) {
    return NextResponse.json({ success: false, message: 'Secret tidak valid.' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const p: any = payload

  const result: SeedResult = {
    success: false,
    message: '',
    version: '1.0.0',
    skipped: [],
    seeded: {},
    errors: [],
    duration_ms: 0,
  }

  // ── Langkah seeding (urutan penting: COA → members → org → transaksi) ──
  const steps: SeedStep[] = [
    { name: 'COA (Chart of Accounts)', fn: () => seedCOA(p) },
    { name: 'Members (Admin)', fn: () => seedAdminMembers(p) },
    { name: 'Users & Members (Dummy)', fn: () => seedDummyMembers(p) },
    { name: 'Pengurus (Board Members)', fn: () => seedBoardMembers(p) },
    { name: 'Pengawas (Supervisors)', fn: () => seedSupervisors(p) },
    { name: 'Karyawan (Employees)', fn: () => seedEmployees(p) },
    { name: 'Simpanan (Savings)', fn: () => seedSavings(p) },
    { name: 'Pinjaman (Loans)', fn: () => seedLoans(p) },
    { name: 'Buku Tamu (Guest Book)', fn: () => seedGuestBook(p) },
    { name: 'Buku Saran (Suggestions)', fn: () => seedSuggestions(p) },
    { name: 'Buku Rapat (Meetings)', fn: () => seedMeetings(p) },
    { name: 'Buku Kejadian Penting (Logs)', fn: () => seedLogs(p) },
    { name: 'Buku Kas (Ledger)', fn: () => seedLedger(p) },
    { name: 'Buku Inventaris (Assets)', fn: () => seedAssets(p) },
    { name: 'Buku Ekspedisi (Mail Log)', fn: () => seedMailLog(p) },
    { name: 'Produk (Products)', fn: () => seedProducts(p) },
    { name: 'Berita (News)', fn: () => seedNews(p) },
  ]

  try {
    for (const step of steps) {
      try {
        const res = await step.fn()
        if (res.count === 0 && res.note) {
          result.skipped.push(`${step.name} → ${res.note}`)
        } else {
          result.seeded[step.name] = res.count
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        result.errors.push(`${step.name}: ${msg}`)
      }
    }

    result.success = result.errors.length === 0
    result.message = result.errors.length === 0
      ? `Seeding selesai. ${Object.keys(result.seeded).length} koleksi berhasil, ${result.skipped.length} dilewati.`
      : `Seeding selesai dengan ${result.errors.length} error.`
    result.duration_ms = Date.now() - start

    return NextResponse.json(result)
  } catch (error) {
    result.errors.push(`Fatal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    result.message = 'Seeding gagal total.'
    result.duration_ms = Date.now() - start
    return NextResponse.json(result, { status: 500 })
  }
}
