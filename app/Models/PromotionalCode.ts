import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PromotionalCode extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public canBeUsed: number

  @column()
  public discount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
