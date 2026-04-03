import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const payload = await getPayload({ config })

  try {
    // 1. Buku Daftar Anggota (Members)
    const m1 = await payload.create({
      collection: 'members',
      data: {
        fullName: 'H. Sudirman',
        nik: '3201012345678901',
        membershipStatus: 'active',
        joinDate: '2025-01-01T00:00:00.000Z',
      },
    })
    const m2 = await payload.create({
      collection: 'members',
      data: {
        fullName: 'Dr. Wahyudi',
        nik: '3201019876543210',
        membershipStatus: 'active',
        joinDate: '2025-01-01T00:00:00.000Z',
      },
    })
    const m3 = await payload.create({
      collection: 'members',
      data: {
        fullName: 'Rina Kartika',
        nik: '3201015678901234',
        membershipStatus: 'active',
        joinDate: '2025-06-01T00:00:00.000Z',
      },
    })

    // 2. Daftar Pengurus (BoardMembers)
    await payload.create({
      collection: 'board-members',
      data: {
        member: m1.id,
        position: 'chairman',
        periodStart: '2025-01-01T00:00:00.000Z',
        periodEnd: '2030-01-01T00:00:00.000Z',
        status: 'active',
      },
    })

    // 3. Daftar Pengawas (Supervisors)
    await payload.create({
      collection: 'supervisors',
      data: {
        member: m2.id,
        position: 'member',
        periodStart: '2025-01-01T00:00:00.000Z',
        periodEnd: '2030-01-01T00:00:00.000Z',
        status: 'active',
      },
    })

    // 4. Daftar Karyawan (Employees)
    await payload.create({
      collection: 'employees',
      data: {
        member: m3.id,
        position: 'teller',
        department: 'Simpan Pinjam',
        joinDate: '2025-06-01T00:00:00.000Z',
        employmentStatus: 'contract',
        status: 'active',
      },
    })

    // 5. Buku Tamu (GuestBook)
    await payload.create({
      collection: 'guest-book',
      data: {
        date: new Date().toISOString(),
        guestName: 'Drs. Supriadi',
        title: 'Kepala Dinas Koperasi',
        organization: 'Dinas Koperasi Kab. Bandung',
        purpose: 'visit',
        followUpActions: 'Belum ada',
      },
    })

    // 6. Buku Simpanan Anggota (Savings)
    await payload.create({
      collection: 'savings',
      data: {
        member: m1.id,
        type: 'pokok',
        transactionType: 'deposit',
        amount: 500000,
        status: 'completed',
        method: 'cash'
      },
    })

    // 7. Buku Saran Anggota (Suggestions)
    await payload.create({
      collection: 'suggestions',
      data: {
        category: 'member',
        date: new Date().toISOString(),
        subject: 'Waktu Layanan Kasir',
        submittedBy: 'H. Sudirman',
        content: 'Kasir sebaiknya buka lebih awal di jam 07:30',
        status: 'in_review',
      },
    })

    // 8. Buku Anjuran Pejabat (Suggestions)
    await payload.create({
      collection: 'suggestions',
      data: {
        category: 'officer',
        date: new Date().toISOString(),
        subject: 'Audit Eksternal Tahunan',
        submittedBy: 'Kepala Dinas Koperasi',
        content: 'Koperasi diharapkan menyewa auditor publik tahun ini.',
        status: 'resolved',
      },
    })

    // 9. Buku Anjuran Pejabat Instansi Lain (Suggestions)
    await payload.create({
      collection: 'suggestions',
      data: {
        category: 'external_officer',
        date: new Date().toISOString(),
        subject: 'Sosialisasi Pajak',
        submittedBy: 'Petugas Pajak Kab. Bandung',
        content: 'Ada penyesuaian perhitungan pajak badan koperasi.',
        status: 'in_review',
      },
    })

    // 10. Buku Keputusan Rapat Pengawas (Meetings)
    await payload.create({
      collection: 'meetings',
      data: {
        title: 'Rapat Evaluasi Triwulan 1',
        meetingType: 'supervisor',
        status: 'conducted',
        date: new Date().toISOString(),
        chairperson: 'Dr. Wahyudi',
      },
    })

    // 11. Buku Keputusan Rapat Pengurus (Meetings)
    await payload.create({
      collection: 'meetings',
      data: {
        title: 'Rapat Persiapan Program Baru',
        meetingType: 'board',
        status: 'conducted',
        date: new Date().toISOString(),
        chairperson: 'H. Sudirman',
      },
    })

    // 12. Buku Keputusan Rapat Anggota (Meetings)
    await payload.create({
      collection: 'meetings',
      data: {
        title: 'Rapat Anggota Luar Biasa (RALB)',
        meetingType: 'member',
        status: 'conducted',
        date: new Date().toISOString(),
        location: 'Aula Desa Merah Putih',
      },
    })

    // 13. Buku Catatan Kejadian Penting (Logs)
    await payload.create({
      collection: 'logs',
      data: {
        date: new Date().toISOString(),
        title: 'Implementasi 16 Buku Administrasi',
        category: 'organizational',
        importance: 'high',
        content: 'Aplikasi SIKDMP sukses menerapkan format standar 16 Buku Administrasi.',
      },
    })

    // 14. Buku Kas (Ledger)
    await payload.create({
      collection: 'ledger',
      data: {
        date: new Date().toISOString(),
        description: 'Setoran Dana Bantuan Awal',
        entries: [
          { account: '1-1001', debit: 50000000, credit: 0 },
          { account: '3-1001', debit: 0, credit: 50000000 },
        ],
        journalType: 'cash-in',
      },
    })

    // 15. Catatan Inventaris (Assets)
    await payload.create({
      collection: 'assets',
      data: {
        assetCode: 'INV-2026-001',
        name: 'Komputer Kasir SIKDMP',
        category: 'electronics',
        acquisitionDate: '2026-04-03T00:00:00.000Z',
        acquisitionCost: 15000000,
        condition: 'good',
      },
    })

    // 16. Buku Agenda (MailLog)
    await payload.create({
      collection: 'mail-log',
      data: {
        date: new Date().toISOString(),
        mailType: 'outgoing',
        mailNumber: '002/KDMP/IV/2026',
        senderOrRecipient: 'Seluruh Anggota',
        subject: 'Pemberitahuan Sistem 16 Buku',
      },
    })

    return new NextResponse(
      '<div style="font-family: sans-serif; padding: 40px; text-align: center;"><h1>✅ 16 Buku Administrasi Berhasil Diisi!</h1><p>Data dummy terstruktur dan optimal telah dimasukkan ke database.</p><p><a href="/admin" style="display:inline-block; margin-top:20px; padding: 10px 20px; background: #DC2626; color: white; text-decoration: none; border-radius: 8px;">Kembali ke Admin Panel</a></p></div>', 
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (error: any) {
    console.error('Seeding 16 Buku Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
