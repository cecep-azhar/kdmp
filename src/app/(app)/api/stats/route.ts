import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(req.url)
  const isReports = searchParams.get('reports') === 'true'

  try {
    const [members, savings, loans, products, transactions, ledger] = await Promise.all([
      payload.find({ collection: 'members', limit: 0 }),
      payload.find({ collection: 'savings', limit: 0 }),
      payload.find({ collection: 'loans', limit: 0 }),
      payload.find({ collection: 'products', limit: 0 }),
      payload.find({ collection: 'transactions', limit: 0 }),
      payload.find({ collection: 'ledger', limit: 0 }),
    ])

    // Hitung Ringkasan Statistik Utama
    const stats = {
      totalMembers: members.totalDocs,
      activeMembers: members.docs.filter((m: any) => m.membershipStatus === 'active').length,
      totalSavingsCount: savings.totalDocs,
      totalLoans: loans.totalDocs,
      pendingLoans: loans.docs.filter((l: any) => l.status === 'pending').length,
      activeLoans: loans.docs.filter((l: any) => l.status === 'active').length,
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

    // Perhitungan Laporan Detail & SHU
    const reports = {
      totalInterest: loans.docs.reduce((acc: number, l: any) => {
        // Dari jadwal angsuran yang sudah dibayar
        const paidI = l.installmentSchedule?.filter((i: any) => i.status === 'paid') || []
        return acc + paidI.reduce((sum: number, i: any) => sum + (i.interest || 0), 0)
      }, 0),
      totalSales: transactions.docs.reduce((acc: number, t: any) => acc + (t.totalAmount || 0), 0),
      // Dummy expenses calculation for now (15% of revenue)
      totalExpenses: Math.round((stats.todayRevenue || 0) * 0.15) + 500000, 
      memberCount: stats.totalMembers,
      loanCount: stats.activeLoans,
      transactionCount: transactions.totalDocs,
    }

    // @ts-ignore
    reports.totalRevenue = (reports.totalInterest || 0) + (reports.totalSales || 0)
    // @ts-ignore
    reports.shu = reports.totalRevenue - reports.totalExpenses

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
      reports: isReports ? reports : undefined,
      activities: [...recentMembers, ...recentTransactions].slice(0, 5)
    })
  } catch (error) {
    console.error('Stats API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
