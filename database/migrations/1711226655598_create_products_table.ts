import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    if (await this.schema.hasTable(this.tableName)) return
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.float('unit_price').notNullable()
      table.string('currency_id').defaultTo('BRL')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
