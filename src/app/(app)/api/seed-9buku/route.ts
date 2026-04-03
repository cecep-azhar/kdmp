import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const payload = await getPayload({ config })

  try {
    // 1. Buku Induk Anggota (Members)
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

    // 5. Daftar Buku Tamu (GuestBook)
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

    // 6. Saran & Anjuran (Suggestions)
    await payload.create({
      collection: 'suggestions',
      data: {
        date: new Date().toISOString(),
        subject: 'Penambahan Limit Pinjaman Khusus Usaha',
        submittedBy: 'Ahmad Faisal (Anggota)',
        content: 'Mohon dipertimbangkan untuk anggota yang memiliki UMKM bisa dinaikkan limitnya agar lebih membantu modal.',
        status: 'in_review',
      },
    })

    // 7. Ekspedisi Surat (MailLog)
    await payload.create({
      collection: 'mail-log',
      data: {
        date: new Date().toISOString(),
        mailType: 'incoming',
        mailNumber: '001/DKOP/IV/2026',
        senderOrRecipient: 'Dinas Koperasi',
        subject: 'Undangan Rapat Koordinasi Tahunan',
        notes: 'Disposisi ke Ketua Umum',
      },
    })

    // 8. Buku Kejadian Penting (Logs)
    await payload.create({
      collection: 'logs',
      data: {
        date: new Date().toISOString(),
        title: 'Peresmian Aplikasi SIKDMP',
        eventType: 'milestone',
        description: 'Aplikasi SIKDMP sukses diluncurkan hari ini dengan akses untuk admin dan seluruh anggota secara langsung.',
        reportedBy: 'Super Admin',
      },
    })

    // 9. Buku Notulen Rapat (Meetings)
    await payload.create({
      collection: 'meetings',
      data: {
        title: 'Rapat Persiapan RAT 2026',
        meetingType: 'pengurus',
        status: 'conducted',
        date: new Date().toISOString(),
        location: 'Kantor Cabang KDMP',
        chairperson: 'H. Sudirman',
        secretary: 'Rina Kartika',
      },
    })

    return new NextResponse(
      '<div style="font-family: sans-serif; padding: 40px; text-align: center;"><h1>✅ 9 Buku Koperasi Berhasil Diisi!</h1><p>Data dummy untuk seluruh administrasi buku koperasi (Induk, Pengurus, Surat, Rapat, dsb) telah ditambahkan.</p><p><a href="/admin" style="display:inline-block; margin-top:20px; padding: 10px 20px; background: #DC2626; color: white; text-decoration: none; border-radius: 8px;">Kembali ke Admin Panel</a></p></div>', 
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (error: any) {
    console.error('Seeding 9 Buku Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
