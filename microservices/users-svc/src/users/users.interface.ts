import { FindOptions } from 'sequelize'

import { User } from './user.model'
import { UserDto } from './user.dto'
import { ICount } from '../commons/commons.interface'

export interface IUsersService {
  find(query?: FindOptions): Promise<{ rows: User[]; pageInfo: ICount }>
  findById(id: string): Promise<User>
  findOne(query?: FindOptions): Promise<User>
  count(query?: FindOptions): Promise<number>
  create(comment: UserDto): Promise<User>
  update(id: string, comment: UserDto): Promise<User>
  destroy(query?: FindOptions): Promise<number>
}
