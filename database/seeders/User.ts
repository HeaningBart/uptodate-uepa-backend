import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.updateOrCreateMany('email', [
      {
        email: 'admin@admin.com',
        role: 'Admin',
        authorizedUntil: new Date(),
        isAuthorized: false,
        password: 'admin123',
      },
    ])
  }
}
