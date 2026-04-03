import { getPayload } from 'payload'
import config from './src/payload.config'

const createAdmin = async () => {
  const payload = await getPayload({ config })

  const email = 'admin@kdmp.com'
  const password = 'admin123'

  console.log(`Checking if user ${email} exists...`)

  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (existingUsers.totalDocs > 0) {
    console.log('User exists. Updating password and roles...')
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
    console.log('User does not exist. Creating new super admin...')
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

  console.log('--- DONE ---')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  process.exit(0)
}

createAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
