import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Only {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    roles: string[]
  ) {
    const user = auth.user

    if (!user) return response.unauthorized()

    if (!roles.includes(user.role)) response.unauthorized()

    await next()
  }
}
