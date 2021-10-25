import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { PrimaryGeneratedColumn } from 'typeorm'

@Table({ tableName: 'users', underscored: true })
export class User extends Model<User> {

  @Column
  username: string

  @Column
  password: string
}