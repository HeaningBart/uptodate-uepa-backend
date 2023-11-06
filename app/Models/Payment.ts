import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public custom_id: string

  @column()
  public preference_id: string

  @column()
  public description: string

  @column()
  public paid: boolean

  @column()
  public amount: number

  @column()
  public user_id: number

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
