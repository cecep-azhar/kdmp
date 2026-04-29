import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * PATCH /api/notifications/[id]/read
 * Tandai notifikasi sebagai sudah dibaca
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
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

    // Check if user is admin
    const isAdmin =
      user.roles?.includes('super-admin') || user.roles?.includes('pengurus')

    // Update notification to mark as read
    const updated = await payload.update({
      collection: 'notifications' as any,
      id,
      data: {
        isRead: true,
        readAt: new Date().toISOString(),
      } as any,
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('Notification read error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 },
    )
  }
}