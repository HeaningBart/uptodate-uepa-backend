import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      email: 'gustavo.araujo@aluno.uepa.br',
      password: 'admin123',
      role: 'Admin',
      authorizedUntil: new Date(),
      isAuthorized: true,
    })
  }
}
