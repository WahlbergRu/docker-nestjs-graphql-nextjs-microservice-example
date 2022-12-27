import { isEmpty } from 'lodash'
import { PinoLogger } from 'nestjs-pino'
import { Injectable, Logger } from '@nestjs/common'
import { FindAndCountOptions, FindOptions } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'

import { IUsersService } from './users.interface'

import { User } from './user.model'
import { UserDto } from './user.dto'
import { ICount } from '../commons/commons.interface'

@Injectable()
export class UsersService implements IUsersService {
  private readonly logger = new PinoLogger({ renameContext: UsersService.name })

  constructor(@InjectModel(User) private readonly repo: typeof User) {}

  async find(query?: FindAndCountOptions): Promise<{ rows: User[]; pageInfo: ICount }> {
    this.logger.warn('UsersService#findAll.call %o', query)

    // @ts-ignore
    const result: { rows: Post[]; count: number; pageInfo: ICount } = await this.repo.findAndCountAll({
      ...query,
      paranoid: false
    })

    result.pageInfo = { count: result.count }

    this.logger.info('UsersService#findAll.result %o', result)

    return result
  }

  async findById(id: string): Promise<User> {
    this.logger.warn('UsersService#findById.call %o', id)

    const result: User = await this.repo.findByPk(id, {
      raw: true
    })

    this.logger.warn('UsersService#findById.result %o', result)

    return result
  }

  async findOne(query: FindOptions): Promise<User> {
    this.logger.warn('UsersService#findOne.call %o', query)

    const result: User = await this.repo.findOne({
      ...query,
      raw: true
    })

    this.logger.warn('UsersService#findOne.result %o', result)

    return result
  }

  async count(query?: FindOptions): Promise<number> {
    this.logger.warn('UsersService#count.call %o', query)

    const result: number = await this.repo.count(query)

    this.logger.warn('UsersService#count.result %o', result)

    return result
  }

  async create(user: UserDto): Promise<User> {
    this.logger.warn('UsersService#create.call %o', user)

    const result: User = await this.repo.create(user)

    this.logger.warn('UsersService#create.result %o', result)

    return result
  }

  async update(id: string, user: UserDto): Promise<User> {
    this.logger.warn('UsersService#update.call %o', user)

    const record: User = await this.repo.findByPk(id)

    if (isEmpty(record)) throw new Error('Record not found.')

    const result: User = await record.update(user)

    this.logger.warn('UsersService#update.result %o', result)

    return result
  }

  async destroy(query?: FindOptions): Promise<number> {
    this.logger.warn('UsersService#destroy.call %o', query)

    const result: number = await this.repo.destroy(query)

    this.logger.warn('UsersService#destroy.result %o', result)

    return result
  }
}
