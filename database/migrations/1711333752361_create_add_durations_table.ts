import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('duration').notNullable().defaultTo(30)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => table.dropColumn('duration'))
  }
}
