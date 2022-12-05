import { FindAndCountOptions, FindOptions } from 'sequelize'

import { User } from './user.model'
import { UserDto } from './user.dto'

export interface IUsersService {
  find(query?: FindOptions): Promise<FindOptions<User>>
  findById(id: string): Promise<User>
  findOne(query?: FindOptions): Promise<User>
  count(query?: FindOptions): Promise<number>
  create(comment: UserDto): Promise<User>
  update(id: string, comment: UserDto): Promise<User>
  destroy(query?: FindOptions): Promise<number>
}
