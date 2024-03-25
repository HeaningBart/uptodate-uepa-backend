import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'
import { UpdateUserPayload } from '#types/users'
type UserDataResponse = {
  isLoggedIn: boolean
  user?:
    | User
    | {
        role: string
      }
    | undefined
}
@inject()
export default class UsersController {
  constructor(protected users_service: UserService) {}

  async get({ response, auth }: HttpContext) {
    const isLoggedIn = auth.isAuthenticated
    const user = isLoggedIn
      ? auth.user
      : {
          role: 'Guest',
        }
    const request_response: UserDataResponse = {
      isLoggedIn,
      user,
    }
    response.send(request_response)
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    console.log(email, password)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user, undefined, {
      expiresIn: '30 days',
    })
    return response.json(token.toJSON())
  }

  public async query({ request, response, bouncer }: HttpContext) {
    const query_string = request.input('query', '')
    const order = request.input('order', 'asc')
    const orderBy = request.input('orderBy', 'id')
    const role = request.input('role', 'All')
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 12)
    const series_ids = JSON.parse(request.input('series_ids', '[]')) || []

    const users = await this.users_service.query({
      query_string,
      order,
      orderBy,
      role,
      page,
      perPage,
      series_ids,
    })

    response.send(users)
  }

  async register({ request, response }: HttpContext) {
    const { email, password, username } = request.only(['email', 'username', 'password'])
    await this.users_service.register(username, password, email)
    response.status(201)
  }

  async update({ request, response }: HttpContext) {
    const user_id = request.param('id')
    const updatePayload = request.all()
    await this.users_service.update_user(user_id, updatePayload)
    response.status(200)
  }
}
