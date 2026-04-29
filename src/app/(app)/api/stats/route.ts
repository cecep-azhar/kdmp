export const runtime = 'nodejs'
import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { NextResponse } from 'next/server'
import type { Payload } from 'payload'

// BUG FIX #9: Define proper interfaces instead of using `any`
interface InstallmentEntry {
  status: string
  interest?: number
  principal?: number
  total?: number
}

interface LoanDoc {
  status: string
  amount?: number
  interestRate?: number
  installmentSchedule?: InstallmentEntry[]
  createdAt: string
}

interface TransactionDoc {
  totalAmount?: number
  createdAt: string
  transactionId?: string
}

interface ProductDoc {
  stock?: number
  minStock?: number
}

interface MemberDoc {
  membershipStatus?: string
  createdAt: string
  fullName?: string
}

interface SavingsDoc {
  amount?: number
  status?: string
  transactionType?: string
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

interface StatsResponse {
  stats: {
    totalMembers: number
    activeMembers: number
    totalSavingsAmount: number
    totalSavingsTransactions: number
    totalLoans: number
    pendingLoans: number
    activeLoans: number
    totalProducts: number
    lowStockProducts: number
    todayTransactions: number
    todayRevenue: number
  }
  reports?: ReportData
  activities?: Array<{
    text: string
    time: string
    type: string
  }>
}

// BUG FIX #6: Add pagination support with configurable limits
const DEFAULT_LIMIT = 1000 // Safe default to prevent memory exhaustion
const MAX_LIMIT = 5000 // Hard cap to prevent DoS

export const GET = async (req: Request) => {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(req.url)
  const isReports = searchParams.get('reports') === 'true'
  const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), MAX_LIMIT)

  try {
    // BUG FIX #6: Use pagination with safe limits instead of limit: 0
    const [members, savings, loans, products, transactions] = await Promise.all([
      payload.find({ collection: 'members', limit }) as Promise<{ docs: MemberDoc[]; totalDocs: number }>,
      payload.find({ collection: 'savings', limit }) as Promise<{ docs: SavingsDoc[]; totalDocs: number }>,
      payload.find({ collection: 'loans', limit }) as Promise<{ docs: LoanDoc[]; totalDocs: number }>,
      payload.find({ collection: 'products', limit }) as Promise<{ docs: ProductDoc[]; totalDocs: number }>,
      payload.find({ collection: 'transactions', limit }) as Promise<{ docs: TransactionDoc[]; totalDocs: number }>,
    ])

    // Calculate total savings amount from completed savings transactions
    const totalSavingsAmount = savings.docs
      .filter((s: SavingsDoc) => s.status === 'completed')
      .reduce((acc: number, s: SavingsDoc) => acc + (s.amount || 0), 0)

    // Count completed deposit transactions (each deposit is a transaction)
    const totalSavingsTransactions = savings.docs.filter((s: SavingsDoc) =>
      s.status === 'completed' && s.transactionType === 'deposit'
    ).length

    // Hitung Ringkasan Statistik Utama
    const stats = {
      totalMembers: members.totalDocs, // Use totalDocs for accurate count
      activeMembers: members.docs.filter((m: MemberDoc) => m.membershipStatus === 'active').length,
      totalSavingsAmount,
      totalSavingsTransactions,
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

    // BUG FIX #1: SHU calculation improved
    // SHU = Total Pendapatan - Total Beban Operasional
    // Untuk tahap awal, estimasi beban sebagai 25% dari total pendapatan (lebih realistis)
    const totalRevenue = totalInterest + totalSales
    const estimatedExpenses = Math.round(totalRevenue * 0.25) // 25% untuk biaya operasional

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
      text: `Anggota baru bergabung: ${m.fullName || 'N/A'}`,
      time: new Date(m.createdAt).toLocaleDateString('id-ID'),
      type: 'member'
    }))

    const recentTransactions = transactions.docs.slice(0, 5).map((t: TransactionDoc) => ({
      text: `Transaksi POS: ${t.transactionId || 'N/A'} - Rp ${t.totalAmount?.toLocaleString()}`,
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
