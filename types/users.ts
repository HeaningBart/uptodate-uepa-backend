import User from '#models/user'
export interface UserQueryParams {
  query_string: string
  role: User['role'] | 'All'
  orderBy: string
  series_ids: number[]
  order: 'asc' | 'desc'
  page: number
  perPage: number
}
export type UpdateUserPayload = {
  role?: 'Admin' | 'User' | undefined
  password?: string | undefined
  authorizedUntil?: string
}
