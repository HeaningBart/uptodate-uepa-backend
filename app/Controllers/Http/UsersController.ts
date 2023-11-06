import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Users from 'App/Services/Users'

import UsersService from 'App/Services/Users'
import { UserDataResponse } from 'App/Services/Users/interfaces'

export default class UsersController {
  async getUserData({ response, auth }: HttpContextContract) {
    const user = auth.user
    const isLoggedIn = auth.isLoggedIn
    const request_response: UserDataResponse = {
      isLoggedIn,
      user,
    }
    response.send(request_response)
  }
  public async getUser({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const user = await Users.get_user_by_id(id)
    response.send(user)
  }

  public async register({ request, response }: HttpContextContract) {
    const { email, password } = request.all()
    await UsersService.create(email, password)
    response.status(200)
  }

  async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '30d',
    })
    response.send({ token })
  }

  async getUserStatus({ response, bouncer }: HttpContextContract) {
    const isAllowed = await bouncer.with('ReaderPolicy').allows('canView')
    response.status(200).json({ isAllowed })
  }
}
