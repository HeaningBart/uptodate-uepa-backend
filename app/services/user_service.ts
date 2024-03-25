import User from '#models/user'
import type { UpdateUserPayload, UserQueryParams } from '#types/users'
import stringHelpers from '@adonisjs/core/helpers/string'
import { HttpContext } from '@adonisjs/core/http'
import backblaze_service from '#services/backblaze_service'
import { inject } from '@adonisjs/core'

@inject()
export default class UserService {
  constructor(protected backblaze: backblaze_service) {}

  genPassword() {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var passwordLength = 12
    var password = ''
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length)
      password += chars.substring(randomNumber, randomNumber + 1)
    }
    return password
  }

  async get_user_by_id(id: number) {
    return await User.findOrFail(id)
  }

  async register(username: string, password: string, email: string) {
    await User.create({
      password: stringHelpers.condenseWhitespace(password),
      email: stringHelpers.condenseWhitespace(email),
      authorizedUntil: new Date(new Date().setDate(new Date().getDate() + 1)),
    })
  }

  async query({ query_string, order, orderBy, page, perPage, role }: UserQueryParams) {
    const users = await User.query()
      .where((query) => {
        query.orWhere('email', 'ILIKE', `%${query_string}%`)
      })
      .if(role !== 'All', (query) => query.andWhere('role', role))
      .orderBy(orderBy, order)
      .paginate(page, perPage)
    return users.serialize()
  }

  async update_user(user_id: number, data: UpdateUserPayload) {
    const current_user = HttpContext.get()?.auth.user!
    const user = await this.get_user_by_id(user_id)
    if (current_user.role === 'Admin') {
      user.merge(data)
    }
    await user.save()
  }
}
