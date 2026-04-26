export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

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

    // Ambil ringkasan simpanan
    const savings = await payload.find({
      collection: 'savings',
      where: {
        and: [
          { member: { equals: member.id } },
          { status: { equals: 'completed' } },
        ],
      },
      limit: 0,
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

    return NextResponse.json({
      success: true,
      data: {
        memberId: member.memberId,
        fullName: member.fullName,
        membershipStatus: member.membershipStatus,
        joinDate: member.joinDate,
        phone: member.phone,
        address: member.address,
        summary: {
          totalSavingsTransactions: savings.totalDocs,
          activeLoans: activeLoans.docs.map((loan: any) => ({
            loanId: loan.loanId,
            amount: loan.amount,
            status: loan.status,
            remainingBalance: loan.remainingBalance,
          })),
        },
      },
    })
  } catch (error: any) {
    console.error('Member profile fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan internal' },
      { status: 500 },
    )
  }
}
