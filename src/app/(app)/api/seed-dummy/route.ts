import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const names = [
  'Ahmad Suryawan', 'Budi Harsono', 'Candra Wijaya', 'Dedi Kurniawan', 'Eka Putra',
  'Fajar Nugroho', 'Gilang Pratama', 'Hendra Gunawan', 'Indra Lesmana', 'Joko Susanto',
  'Kusuma Wardani', 'Lukman Hakim', 'Muhammad Ridwan', 'Nurudin', 'Omar Hidayat',
  'Prabowo', 'Qomaruddin', 'Reza Pahlevi', 'Siti Aminah', 'Tari Mulyani',
  'Umar Syahid', 'Vina Panduwinata', 'Wawan Setiawan', 'Xaverius', 'Yayan Ruhian'
]

export const GET = async () => {
  const payload = await getPayload({ config })
  
  try {
    const defaultParams = { where: { id: { exists: true } }, limit: 1000 }
    
    // 1. WIPING PHASE (Hapus dari anak ke bapak)
    await payload.delete({ collection: 'board-members', ...defaultParams })
    await payload.delete({ collection: 'supervisors', ...defaultParams })
    await payload.delete({ collection: 'employees', ...defaultParams })
    await payload.delete({ collection: 'savings', ...defaultParams })
    await payload.delete({ collection: 'members', ...defaultParams })
    const usersToDelete = await payload.find({ collection: 'users', limit: 1000 })
    for (const user of usersToDelete.docs) {
      if (user.email !== 'admin@kdmp.com') {
        await payload.delete({ collection: 'users', id: user.id })
      }
    }
    
    // 2. SEEDING PENGURUS & ANGGOTA (Daftar nama unik tanpa duplikasi)
    const membersList = []
    for (let i = 0; i < names.length; i++) {
        const emailAddress = `anggota${i}@koperasi.id`
        
        // Buat akun User untuk login
        const user = await payload.create({
            collection: 'users',
            data: {
                name: names[i],
                email: emailAddress,
                password: 'password123',
                roles: i === 0 ? ['pengurus'] : (i < 6 ? ['pengurus'] : ['anggota']), 
            }
        })
        
        // Buat detail Member yang terkait dengan user di atas
        const member = await payload.create({
            collection: 'members',
            data: {
                user: user.id as string,
                fullName: names[i],
                nik: `3273${String(randomNumber(100000000000, 999999999999))}`,
                gender: randomNumber(0, 1) === 1 ? 'male' : 'female',
                birthPlace: 'Bandung',
                birthDate: new Date(Date.now() - randomNumber(20*365, 50*365) * 86400000).toISOString(),
                phone: `08${randomNumber(100000000, 999999999)}`,
                address: `Jl. Koperasi ${i+1}`,
                occupation: 'Penduduk',
                membershipStatus: 'active',
                joinDate: new Date().toISOString(),
            }
        })
        membersList.push(member)
    }

    // PENGURUS (Board Members) - HANYA 1 KETUA, 1 WAKIL, 1 SEKRETARIS, 1 BENDAHARA, OTHERS = ANGGOTA
    const boardPositions = ['chairman', 'vice_chairman', 'secretary', 'treasurer', 'member', 'member']
    for (let i = 0; i < boardPositions.length; i++) {
        await payload.create({
            collection: 'board-members',
            data: {
                member: membersList[i].id as string,
                position: boardPositions[i] as any,
                periodStart: new Date().toISOString(),
                status: 'active'
            }
        })
    }

    // PENGAWAS (Supervisors) - HANYA 1 KETUA PENGAWAS, 2 ANGGOTA PENGAWAS
    const supervisorPositions = ['head', 'member', 'member']
    for (let i = 0; i < supervisorPositions.length; i++) {
        await payload.create({
            collection: 'supervisors',
            data: {
                member: membersList[i + 6].id as string, // ambil dari index ke-6 dst
                position: supervisorPositions[i] as any,
                periodStart: new Date().toISOString(),
                status: 'active'
            }
        })
    }

    // KARYAWAN (Employees)
    const employeePositions = ['manager', 'teller', 'admin']
    for (let i = 0; i < employeePositions.length; i++) {
        await payload.create({
            collection: 'employees',
            data: {
                member: membersList[i + 9].id as string, // dari index ke-9 dst
                position: employeePositions[i],
                hireDate: new Date().toISOString(),
                status: 'active'
            }
        })
    }

    // TRANSAKSI SIMPANAN
    // 1. Simpanan Pokok untuk semua 25 anggota (wajib saat daftar koperasi)
    for (const member of membersList) {
        await payload.create({
            collection: 'savings',
            data: {
                member: member.id as string,
                type: 'pokok',
                transactionType: 'deposit',
                amount: 100000,
                status: 'completed',
                method: 'cash'
            }
        })
    }

    // 2. Simpanan Wajib & Sukarela secara acak (25-30 data)
    for (let i = 0; i < 25; i++) {
        const randomMember = membersList[randomNumber(0, membersList.length - 1)]
        await payload.create({
            collection: 'savings',
            data: {
                member: randomMember.id as string,
                type: randomNumber(0, 1) === 0 ? 'wajib' : 'sukarela',
                transactionType: 'deposit',
                amount: randomNumber(1, 10) * 50000, // Kelipatan 50rb
                status: 'completed',
                method: 'cash'
            }
        })
    }

    // 3. SEEDING BERITA (10 - 15 Data)
    await payload.delete({ collection: 'news', where: { id: { exists: true } }, limit: 1000 })
    
    const newsCategories = ['news', 'announcement', 'education']
    for (let i = 0; i < 15; i++) {
        await payload.create({
            collection: 'news',
            data: {
                title: `Berita & Pengumuman Koperasi Ke-${i + 1}`,
                slug: `berita-koperasi-ke-${i + 1}-${Date.now()}`,
                category: newsCategories[randomNumber(0, 2)],
                status: 'published',
                publishedAt: new Date(Date.now() - randomNumber(1, 30) * 86400000).toISOString(),
                content: {
                  root: {
                    type: 'root',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                      {
                        type: 'paragraph',
                        format: '',
                        indent: 0,
                        version: 1,
                        children: [
                          {
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: `Ini adalah deskripsi konten berita dummy ke-${i+1} yang secara otomatis dibuat oleh sistem seeder untuk menguji fungsionalitas aplikasi Koperasi Desa Merah Putih.`,
                            type: 'text',
                            version: 1
                          }
                        ]
                      }
                    ]
                  }
                } as any
            }
        })
    }

    return NextResponse.json({ success: true, message: 'Wipe Out & Re-seed Success. Generated 50 savings and 15 news articles.' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack, details: error }, { status: 200 })
  }
}
