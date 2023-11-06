import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class ReaderPolicy extends BasePolicy {
  public async updateProfile(user: User, user_id: number) {
    if (user.id == user_id || user.role === 'Admin') {
      return true
    } else return false
  }

  public async adminActions(user: User) {
    if (user.role === 'Admin') {
      return true
    } else return false
  }

  public async canView(user: User) {
    const { authorizedUntil } = user

    const now = new Date()
    const expiresIn = new Date(authorizedUntil)

    if (expiresIn > now) {
      return true
    } else return false
  }
}
