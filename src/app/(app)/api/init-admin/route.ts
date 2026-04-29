export const runtime = 'nodejs'
import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { NextResponse } from 'next/server'

export const GET = async () => {
  // Security: Only allow in development or with proper secret
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_INIT_ADMIN !== 'true') {
    return NextResponse.json(
      { error: 'Init admin endpoint is disabled in production' },
      { status: 403 }
    )
  }

  const payload = await getPayload({ config })
  const email = 'admin@kdmp.com'
  const password = 'admin123'

  try {
    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    if (existingUsers.totalDocs > 0) {
      await payload.update({
        collection: 'users',
        id: existingUsers.docs[0].id,
        data: {
          password,
          roles: ['super-admin'],
          name: 'Super Admin KDMP',
        },
      })
    } else {
      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          roles: ['super-admin'],
          name: 'Super Admin KDMP',
        },
      })
    }

    return new NextResponse('<h1>✅ Admin KDMP Berhasil Disiapkan</h1><p>Silakan login dengan:<br>Email: admin@kdmp.com<br>Password: admin123</p>', {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
