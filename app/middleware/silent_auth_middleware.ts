import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SilentAuthMiddleware {
  async handle({ auth }: HttpContext, next: NextFn) {
    await auth.check()
    await next()
  }
}
