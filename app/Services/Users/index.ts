import User from 'App/Models/User'
import { UserQueryParams } from './interfaces'

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
        query
          .where('username', 'ILIKE', `%${query_string}%`)
          .orWhere('email', 'ILIKE', `%${query_string}%`)
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
}

export default new UsersService()
