import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const payload = await getPayload({ config })

  try {
    const [members, savings, loans, products, transactions] = await Promise.all([
      payload.find({ collection: 'members', limit: 0 }),
      payload.find({ collection: 'savings', limit: 0 }),
      payload.find({ collection: 'loans', limit: 0 }),
      payload.find({ collection: 'products', limit: 0 }),
      payload.find({ collection: 'transactions', limit: 0 }),
    ])

    // Hitung Ringkasan Statistik
    const stats = {
      totalMembers: members.totalDocs,
      activeMembers: members.docs.filter((m: any) => m.membershipStatus === 'active').length,
      
      // Total Simpanan (Total dari semua transaksi simpanan)
      totalSavingsCount: savings.totalDocs,
      
      // Pinjaman
      totalLoans: loans.totalDocs,
      pendingLoans: loans.docs.filter((l: any) => l.status === 'pending').length,
      activeLoans: loans.docs.filter((l: any) => l.status === 'active').length,
      
      // POS
      totalProducts: products.totalDocs,
      lowStockProducts: products.docs.filter((p: any) => (p.stock || 0) <= (p.minStock || 0)).length,
      todayTransactions: transactions.docs.filter((t: any) => {
        const today = new Date().toISOString().split('T')[0]
        const transDate = new Date(t.createdAt).toISOString().split('T')[0]
        return today === transDate
      }).length,
      todayRevenue: transactions.docs.reduce((acc: number, t: any) => {
        const today = new Date().toISOString().split('T')[0]
        const transDate = new Date(t.createdAt).toISOString().split('T')[0]
        return today === transDate ? acc + (t.totalAmount || 0) : acc
      }, 0),
    }

    // Ambil Aktivitas Terbaru
    const recentMembers = members.docs.slice(0, 3).map((m: any) => ({
      text: `Anggota baru bergabung: ${m.fullName}`,
      time: new Date(m.createdAt).toLocaleDateString('id-ID'),
      type: 'member'
    }))

    const recentTransactions = transactions.docs.slice(0, 5).map((t: any) => ({
      text: `Transaksi POS: ${t.transactionId} - Rp ${t.totalAmount?.toLocaleString()}`,
      time: 'Baru saja',
      type: 'pos'
    }))

    return NextResponse.json({
      stats,
      activities: [...recentMembers, ...recentTransactions].slice(0, 5)
    })
  } catch (error) {
    console.error('Stats API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
