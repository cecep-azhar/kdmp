import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * POST /api/loan-requests
 * API endpoint untuk anggota mengajukan pinjaman baru dari aplikasi mobile
 */
export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })

    // Ambil header authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Token diperlukan' },
        { status: 401 },
      )
    }

    // Verify user dari token
    const { user } = await payload.auth({
      headers: request.headers as any,
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - User tidak ditemukan' },
        { status: 401 },
      )
    }

    // Parse request body
    const body = await request.json()

    // Cari member yang terkait dengan user ini
    const members = await payload.find({
      collection: 'members',
      where: {
        user: { equals: user.id },
      },
      limit: 1,
    })

    if (members.docs.length === 0) {
      return NextResponse.json(
        { error: 'Anda belum terdaftar sebagai anggota koperasi' },
        { status: 403 },
      )
    }

    const member = members.docs[0]

    // Cek apakah anggota masih aktif
    if (member.membershipStatus !== 'active') {
      return NextResponse.json(
        { error: 'Keanggotaan anda tidak aktif' },
        { status: 403 },
      )
    }

    // Cek apakah sudah ada pinjaman aktif
    const activeLoans = await payload.find({
      collection: 'loans',
      where: {
        and: [
          { member: { equals: member.id } },
          {
            status: {
              in: ['pending', 'approved', 'active'],
            },
          },
        ],
      },
      limit: 1,
    })

    if (activeLoans.docs.length > 0) {
      return NextResponse.json(
        { error: 'Anda masih memiliki pinjaman yang aktif atau menunggu persetujuan' },
        { status: 400 },
      )
    }

    // Validasi input
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Jumlah pinjaman harus lebih dari 0' },
        { status: 400 },
      )
    }

    if (!body.tenor || body.tenor < 1 || body.tenor > 60) {
      return NextResponse.json(
        { error: 'Tenor harus antara 1-60 bulan' },
        { status: 400 },
      )
    }

    // Buat pengajuan pinjaman
    const loan = await payload.create({
      collection: 'loans',
      data: {
        member: member.id,
        amount: body.amount,
        tenor: body.tenor,
        interestRate: body.interestRate || 12,
        purpose: body.purpose || 'other',
        purposeDescription: body.purposeDescription || '',
        status: 'pending',
        collateralType: body.collateralType || 'none',
        collateralDescription: body.collateralDescription || '',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Pengajuan pinjaman berhasil dibuat. Menunggu persetujuan pengurus.',
        data: {
          loanId: loan.loanId,
          amount: loan.amount,
          tenor: loan.tenor,
          status: loan.status,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Loan request error:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan internal' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/loan-requests
 * Ambil status pengajuan pinjaman user yang sedang login
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

    // Cari member
    const members = await payload.find({
      collection: 'members',
      where: {
        user: { equals: user.id },
      },
      limit: 1,
    })

    if (members.docs.length === 0) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 },
      )
    }

    // Ambil semua pinjaman milik anggota ini
    const loans = await payload.find({
      collection: 'loans',
      where: {
        member: { equals: members.docs[0].id },
      },
      sort: '-createdAt',
    })

    return NextResponse.json({
      success: true,
      data: loans.docs.map((loan: any) => ({
        loanId: loan.loanId,
        amount: loan.amount,
        tenor: loan.tenor,
        interestRate: loan.interestRate,
        status: loan.status,
        purpose: loan.purpose,
        approvalDate: loan.approvalDate,
        disbursementDate: loan.disbursementDate,
        createdAt: loan.createdAt,
      })),
    })
  } catch (error: any) {
    console.error('Loan request fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan internal' },
      { status: 500 },
    )
  }
}
