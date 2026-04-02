import type { Access } from 'payload'
import { checkRole } from './checkRole'

/**
 * Hanya Super Admin yang bisa mengakses
 */
export const isSuperAdmin: Access = ({ req: { user } }) => {
  return checkRole(['super-admin'], user)
}

/**
 * Admin dan Pengurus yang bisa mengakses
 */
export const isAdminOrPengurus: Access = ({ req: { user } }) => {
  return checkRole(['super-admin', 'pengurus'], user)
}

/**
 * Admin, Pengurus, dan Staff yang bisa mengakses
 */
export const isStaffOrAbove: Access = ({ req: { user } }) => {
  return checkRole(['super-admin', 'pengurus', 'staff'], user)
}

/**
 * Admin, Pengurus, Staff, dan Kasir yang bisa mengakses
 */
export const isKasirOrAbove: Access = ({ req: { user } }) => {
  return checkRole(['super-admin', 'pengurus', 'staff', 'kasir'], user)
}

/**
 * Semua user yang sudah login
 */
export const isLoggedIn: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Anggota hanya bisa melihat data miliknya sendiri
 */
export const isSelfOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (checkRole(['super-admin', 'pengurus', 'staff'], user)) return true

  return {
    member: {
      equals: user.id,
    },
  }
}

/**
 * User hanya bisa melihat data milik sendiri (untuk koleksi Users)
 */
export const isSelfOrAdminUser: Access = ({ req: { user } }) => {
  if (!user) return false
  if (checkRole(['super-admin', 'pengurus'], user)) return true

  return {
    id: {
      equals: user.id,
    },
  }
}
