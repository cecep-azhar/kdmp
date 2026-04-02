import type { User } from '../payload-types'

export type Role =
  | 'super-admin'
  | 'pengurus'
  | 'pengawas'
  | 'staff'
  | 'kasir'
  | 'anggota'

export const checkRole = (requiredRoles: Role[], user?: User | null): boolean => {
  if (!user) return false
  if (user.roles?.includes('super-admin')) return true
  return requiredRoles.some((role) => user.roles?.includes(role))
}
