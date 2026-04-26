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

type CollectionSlug = 'board-members' | 'supervisors' | 'employees' | 'savings' | 'members' | 'news'
type NewsCategory = 'news' | 'announcement' | 'education'

export const GET = async () => {
  const payload = await getPayload({ config })

  try {
    // 1. WIPING PHASE (Hapus dari anak ke bapak)
    const collectionsToWipe: CollectionSlug[] = ['board-members', 'supervisors', 'employees', 'savings', 'members']
    for (const collection of collectionsToWipe) {
      const docs = await payload.find({ collection, limit: 1000 })
      for (const doc of docs.docs) {
        await payload.delete({ collection, id: doc.id })
      }
    }

    // Delete existing news
    const existingNews = await payload.find({ collection: 'news', limit: 1000 })
    for (const news of existingNews.docs) {
      await payload.delete({ collection: 'news', id: news.id })
    }

    const usersToDelete = await payload.find({ collection: 'users', limit: 1000 })
    for (const user of usersToDelete.docs) {
      if (user.email !== 'admin@kdmp.com') {
        await payload.delete({ collection: 'users', id: user.id })
      }
    }

    // 2. SEEDING PENGURUS & ANGGOTA
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

      // Buat detail Member
      const member = await payload.create({
        collection: 'members',
        data: {
          user: typeof user.id === 'number' ? user.id : parseInt(String(user.id), 10),
          fullName: names[i],
          nik: `3273${String(randomNumber(100000000000, 999999999999))}`,
          gender: randomNumber(0, 1) === 1 ? 'male' : 'female',
          birthPlace: 'Bandung',
          birthDate: new Date(Date.now() - randomNumber(20 * 365, 50 * 365) * 86400000).toISOString(),
          phone: `08${randomNumber(100000000, 999999999)}`,
          address: `Jl. Koprasi ${i + 1}`,
          occupation: 'Penduduk',
          membershipStatus: 'active',
          joinDate: new Date().toISOString(),
        }
      })
      membersList.push(member)
    }

    // PENGURUS
    const boardPositions: ('chairman' | 'vice_chairman' | 'secretary' | 'treasurer' | 'member')[] = ['chairman', 'vice_chairman', 'secretary', 'treasurer', 'member', 'member']
    for (let i = 0; i < boardPositions.length; i++) {
      await payload.create({
        collection: 'board-members',
        data: {
          member: typeof membersList[i].id === 'number' ? membersList[i].id : parseInt(String(membersList[i].id), 10),
          position: boardPositions[i],
          periodStart: new Date().toISOString(),
          status: 'active'
        }
      })
    }

    // PENGAWAS
    const supervisorPositions: ('head' | 'member')[] = ['head', 'member', 'member']
    for (let i = 0; i < supervisorPositions.length; i++) {
      await payload.create({
        collection: 'supervisors',
        data: {
          member: typeof membersList[i + 6].id === 'number' ? membersList[i + 6].id : parseInt(String(membersList[i + 6].id), 10),
          position: supervisorPositions[i],
          periodStart: new Date().toISOString(),
          status: 'active'
        }
      })
    }

    // KARYAWAN
    const employeePositions: ('manager' | 'teller' | 'admin')[] = ['manager', 'teller', 'admin']
    for (let i = 0; i < employeePositions.length; i++) {
      await payload.create({
        collection: 'employees',
        data: {
          member: typeof membersList[i + 9].id === 'number' ? membersList[i + 9].id : parseInt(String(membersList[i + 9].id), 10),
          position: employeePositions[i],
          hireDate: new Date().toISOString(),
          status: 'active'
        }
      })
    }

    // TRANSAKSI SIMPANAN
    // 1. Simpanan Pokok
    for (const member of membersList) {
      await payload.create({
        collection: 'savings',
        data: {
          member: typeof member.id === 'number' ? member.id : parseInt(String(member.id), 10),
          type: 'pokok',
          transactionType: 'deposit',
          amount: 100000,
          status: 'completed',
          method: 'cash'
        }
      })
    }

    // 2. Simpanan acak
    for (let i = 0; i < 25; i++) {
      const randomMember = membersList[randomNumber(0, membersList.length - 1)]
      await payload.create({
        collection: 'savings',
        data: {
          member: typeof randomMember.id === 'number' ? randomMember.id : parseInt(String(randomMember.id), 10),
          type: randomNumber(0, 1) === 0 ? 'wajib' : 'sukarela',
          transactionType: 'deposit',
          amount: randomNumber(1, 10) * 50000,
          status: 'completed',
          method: 'cash'
        }
      })
    }

    // 3. SEEDING BERITA
    const newsCategories: NewsCategory[] = ['news', 'announcement', 'education']
    for (let i = 0; i < 15; i++) {
      await payload.create({
        collection: 'news',
        data: {
          title: `Berita & Pengumuman Koprasi Ke-${i + 1}`,
          slug: `berita-koprasi-ke-${i + 1}-${Date.now()}`,
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
                      text: `Ini adalah deskripsi konten berita dummy ke-${i + 1} yang secara otomatis dibuat oleh sistem seeder untuk menguji fungsionalitas aplikasi Koprasi Desa Merah Putih.`,
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
