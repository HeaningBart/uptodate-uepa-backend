import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class ReaderPolicy extends BasePolicy {
  public async canView(user: User) {
    const { authorizedUntil } = user

    const now = new Date()
    const expiresIn = new Date(authorizedUntil)

    if (expiresIn > now) {
      return true
    } else return false
  }
}
