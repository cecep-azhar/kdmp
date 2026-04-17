import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { NextResponse } from 'next/server'

interface LoanDoc {
  status: string
  amount?: number
  interestRate?: number
  installmentSchedule?: Array<{
    status: string
    interest?: number
    principal?: number
    total?: number
  }>
  createdAt: string
}

interface TransactionDoc {
  totalAmount?: number
  createdAt: string
}

interface ProductDoc {
  stock?: number
  minStock?: number
}

interface MemberDoc {
  membershipStatus?: string
  createdAt: string
}

interface ReportData {
  totalInterest: number
  totalSales: number
  totalExpenses: number
  memberCount: number
  loanCount: number
  transactionCount: number
  totalRevenue: number
  shu: number
}

export const GET = async (req: Request) => {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(req.url)
  const isReports = searchParams.get('reports') === 'true'

  try {
    const [members, savings, loans, products, transactions, ledger] = await Promise.all([
      payload.find({ collection: 'members', limit: 0 }) as Promise<{ docs: MemberDoc[]; totalDocs: number }>,
      payload.find({ collection: 'savings', limit: 0 }),
      payload.find({ collection: 'loans', limit: 0 }) as Promise<{ docs: LoanDoc[]; totalDocs: number }>,
      payload.find({ collection: 'products', limit: 0 }) as Promise<{ docs: ProductDoc[]; totalDocs: number }>,
      payload.find({ collection: 'transactions', limit: 0 }) as Promise<{ docs: TransactionDoc[]; totalDocs: number }>,
      payload.find({ collection: 'ledger', limit: 0 }),
    ])

    // Hitung Ringkasan Statistik Utama
    const stats = {
      totalMembers: members.totalDocs,
      activeMembers: members.docs.filter((m: MemberDoc) => m.membershipStatus === 'active').length,
      totalSavingsCount: savings.totalDocs,
      totalLoans: loans.totalDocs,
      pendingLoans: loans.docs.filter((l: LoanDoc) => l.status === 'pending').length,
      activeLoans: loans.docs.filter((l: LoanDoc) => l.status === 'active').length,
      totalProducts: products.totalDocs,
      lowStockProducts: products.docs.filter((p: ProductDoc) => (p.stock || 0) <= (p.minStock || 0)).length,
      todayTransactions: transactions.docs.filter((t: TransactionDoc) => {
        const today = new Date().toISOString().split('T')[0]
        const transDate = new Date(t.createdAt).toISOString().split('T')[0]
        return today === transDate
      }).length,
      todayRevenue: transactions.docs.reduce((acc: number, t: TransactionDoc) => {
        const today = new Date().toISOString().split('T')[0]
        const transDate = new Date(t.createdAt).toISOString().split('T')[0]
        return today === transDate ? acc + (t.totalAmount || 0) : acc
      }, 0),
    }

    // Perhitungan Laporan Detail & SHU
    // SHU (Sisa Hasil Usaha) dihitung berdasarkan:
    // Pendapatan - Beban
    const totalInterest = loans.docs.reduce((acc: number, l: LoanDoc) => {
      const paidInstallments = l.installmentSchedule?.filter((i) => i.status === 'paid') || []
      return acc + paidInstallments.reduce((sum: number, i) => sum + (i.interest || 0), 0)
    }, 0)

    const totalSales = transactions.docs.reduce((acc: number, t: TransactionDoc) => acc + (t.totalAmount || 0), 0)

    // SHU yang proper: Pendapatan Total dikurangi Beban Operasional
    // Untuk tahap awal, kita estimasi beban sebagai 20% dari total pendapatan
    const totalRevenue = totalInterest + totalSales
    const estimatedExpenses = Math.round(totalRevenue * 0.20) // Estimasi 20% untuk biaya operasional

    const reports: ReportData = {
      totalInterest,
      totalSales,
      totalExpenses: estimatedExpenses,
      memberCount: stats.totalMembers,
      loanCount: stats.activeLoans,
      transactionCount: transactions.totalDocs,
      totalRevenue,
      shu: totalRevenue - estimatedExpenses,
    }

    // Ambil Aktivitas Terbaru
    const recentMembers = members.docs.slice(0, 3).map((m: MemberDoc) => ({
      text: `Anggota baru bergabung: ${(m as MemberDoc & { fullName?: string }).fullName || 'N/A'}`,
      time: new Date(m.createdAt).toLocaleDateString('id-ID'),
      type: 'member'
    }))

    const recentTransactions = transactions.docs.slice(0, 5).map((t: TransactionDoc) => ({
      text: `Transaksi POS: ${(t as TransactionDoc & { transactionId?: string }).transactionId || 'N/A'} - Rp ${t.totalAmount?.toLocaleString()}`,
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
