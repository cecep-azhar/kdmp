import { getPayload } from 'payload'
import config from '@payload-config'

interface AuditLogData {
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'approval' | 'rejection'
  userId?: number | string
  userName?: string
  collection?: string
  recordId?: string
  changes?: Record<string, unknown>
  description?: string
  ipAddress?: string
  userAgent?: string
  status?: 'success' | 'failed'
}

/**
 * Create audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'audit-logs' as any,
      data: {
        action: data.action,
        user: data.userId as any,
        userName: data.userName,
        collection: data.collection,
        recordId: data.recordId,
        changes: data.changes as any,
        description: data.description,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        status: data.status || 'success',
      } as any,
    })
  } catch (error) {
    // Silent fail - don't block operations due to audit log failure
    console.error('Failed to create audit log:', error)
  }
}

/**
 * Create notification
 */
export async function createNotification(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: {
    title: string
    message: string
    type?: string
    recipientId: number | string
    priority?: string
    relatedId?: string
    relatedType?: string
  }
): Promise<void> {
  try {
    await payload.create({
      collection: 'notifications' as any,
      data: {
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        recipient: data.recipientId as any,
        priority: data.priority || 'normal',
        relatedId: data.relatedId,
        relatedType: data.relatedType,
      } as any,
    })
  } catch (error) {
    // Silent fail - don't block operations due to notification failure
    console.error('Failed to create notification:', error)
  }
}