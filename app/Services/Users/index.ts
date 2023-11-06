import User from 'App/Models/User'
import { UpdateUserPayload, UserQueryParams } from './interfaces'
import HttpContext from '@ioc:Adonis/Core/HttpContext'

export class UsersService {
  async create(email: string, password: string): Promise<void> {
    await User.create({
      email,
      password,
      isAuthorized: false,
      authorizedUntil: new Date(),
      role: 'User',
    })
  }

  public async query({ query_string, order, orderBy, page, perPage, role }: UserQueryParams) {
    const users = await User.query()
      .where((query) => {
        query.where('email', 'ILIKE', `%${query_string}%`)
      })
      .if(role !== 'All', (query) => query.andWhere('role', role))
      .orderBy(orderBy, order)
      .paginate(page, perPage)
    return users.serialize()
  }

  public async get_user_by_id(user_id: string | number) {
    const user = await User.findOrFail(user_id)

    return user
  }

  public async update_user(user_id: string, data: UpdateUserPayload, current_user: User) {
    const user = await this.get_user_by_id(user_id)

    const ADMIN_ONLY_FIELDS = ['authorizedUntil', 'role']

    if (current_user.role === 'Admin') {
      for (const i in data) {
        console.log(i)
        if (data[i] !== '' && data[i] !== undefined) user[i] = data[i]
      }
    } else {
      for (const i in data) {
        !ADMIN_ONLY_FIELDS.includes(i) && (user[i] = data[i])
      }
    }

    await user.save()
  }
}

export default new UsersService()
