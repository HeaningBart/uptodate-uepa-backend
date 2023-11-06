import User from 'App/Models/User'
import { z } from 'zod'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export interface CreateUserPayload {
  username: string
  password: string
  email: string
}

const userSchema = z.object({
  isLoggedIn: z.boolean(),
  user: z.custom<User | undefined>(),
})

export type UserDataResponse = z.infer<typeof userSchema>

export interface UserQueryParams {
  query_string: string
  role: User['role'] | 'All'
  orderBy: string
  order: 'asc' | 'desc'
  page: number
  perPage: number
}

const updateUserSchema = z.object({
  email: z.string().optional(),
  role: z.enum(['Admin', 'Editor', 'Reader']).optional(),
  password: z.string().optional(),
  authorizedUntil: z.string().optional(),
})

export type UpdateUserPayload = z.infer<typeof updateUserSchema>
