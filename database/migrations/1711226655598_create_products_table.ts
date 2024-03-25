import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
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
    this.schema.dropTableIfNotExists(this.tableName)
  }
}
