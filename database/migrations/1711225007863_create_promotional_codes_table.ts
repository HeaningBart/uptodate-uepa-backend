import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'promotional_codes'

  async up() {
    if (await this.schema.hasTable(this.tableName)) return
    if (await this.schema.hasTable(this.tableName)) return
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug')
      table.integer('can_be_used').defaultTo(0)
      table.float('discount').defaultTo(0.1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
