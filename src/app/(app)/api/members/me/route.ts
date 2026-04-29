export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// BUG FIX: Define proper types instead of using `any`
interface LoanSummary {
  loanId: string
  amount: number
  status: string
  remainingBalance: number
}

interface MemberProfile {
  memberId: string
  fullName: string
  membershipStatus: string
  joinDate: string
  phone?: string
  address?: string
  summary: {
    totalSavingsTransactions: number
    activeLoans: LoanSummary[]
  }
}

/**
 * GET /api/members/me
 * Mengambil profil anggota yang sedang login
 */
export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })

    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { user } = await payload.auth({
      headers: request.headers as any,
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    // Cari member berdasarkan user
    const members = await payload.find({
      collection: 'members',
      where: {
        user: { equals: user.id },
      },
      limit: 1,
    })

    if (members.docs.length === 0) {
      return NextResponse.json(
        { error: 'Profil anggota tidak ditemukan' },
        { status: 404 },
      )
    }

    const member = members.docs[0]

    // BUG FIX #6: Use pagination with safe limits instead of limit: 0
    // Ambil ringkasan simpanan - hanya hitung transaksi saja
    const savings = await payload.find({
      collection: 'savings',
      where: {
        and: [
          { member: { equals: member.id } },
          { status: { equals: 'completed' } },
        ],
      },
      limit: 500, // Safe limit instead of 0
      pagination: true,
    })

    // Ambil pinjaman aktif
    const activeLoans = await payload.find({
      collection: 'loans',
      where: {
        and: [
          { member: { equals: member.id } },
          { status: { in: ['active', 'pending', 'approved'] } },
        ],
      },
      limit: 5,
    })

    const profile: MemberProfile = {
      memberId: member.memberId || '',
      fullName: member.fullName || '',
      membershipStatus: member.membershipStatus || 'unknown',
      joinDate: member.joinDate || '',
      phone: member.phone ?? undefined,
      address: member.address ?? undefined,
      summary: {
        totalSavingsTransactions: savings.totalDocs,
        activeLoans: activeLoans.docs.map((loan) => ({
          loanId: loan.loanId || '',
          amount: loan.amount || 0,
          status: loan.status || 'unknown',
          remainingBalance: loan.remainingBalance || 0,
        })),
      },
    }

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Member profile fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan internal' },
      { status: 500 },
    )
  }
}
