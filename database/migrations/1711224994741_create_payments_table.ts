import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id')
      table.string('custom_id').notNullable()
      table.integer('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('preference_id').notNullable()
      table.boolean('paid').defaultTo(false)
      table.integer('amount').notNullable()
      table.string('description').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
