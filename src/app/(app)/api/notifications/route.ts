import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /api/notifications
 * Ambil notifikasi untuk user yang sedang login
 */
export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })

    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { user } = await payload.auth({
      headers: request.headers as any,
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    // Build where clause manually to avoid TypeScript issues with unknown collections
    const where: any = { recipient: { equals: user.id } }
    if (unreadOnly) {
      where.isRead = { equals: false }
    }

    const notifications = await payload.find({
      collection: 'notifications' as any,
      where,
      sort: '-createdAt',
      limit,
    })

    // Count unread notifications
    const unreadCount = await payload.count({
      collection: 'notifications' as any,
      where: {
        recipient: { equals: user.id },
        isRead: { equals: false },
      },
    })

    return NextResponse.json({
      success: true,
      data: notifications.docs,
      unreadCount: unreadCount.totalDocs,
      total: notifications.totalDocs,
    })
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/notifications
 * Buat notifikasi baru (hanya untuk staff/admin)
 */
export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })

    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { user } = await payload.auth({
      headers: request.headers as any,
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is staff or above
    const isStaffOrAdmin =
      user.roles?.includes('super-admin') ||
      user.roles?.includes('pengurus') ||
      user.roles?.includes('staff')

    if (!isStaffOrAdmin) {
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.message || !body.recipient) {
      return NextResponse.json(
        { error: 'title, message, and recipient are required' },
        { status: 400 },
      )
    }

    const notification = await payload.create({
      collection: 'notifications' as any,
      data: {
        title: body.title,
        message: body.message,
        type: body.type || 'info',
        recipient: body.recipient,
        priority: body.priority || 'normal',
        relatedId: body.relatedId,
        relatedType: body.relatedType,
      } as any,
    })

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('Notifications POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 },
    )
  }
}