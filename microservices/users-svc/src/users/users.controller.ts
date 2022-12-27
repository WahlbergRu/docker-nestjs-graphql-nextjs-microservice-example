import Aigle from 'aigle'

import { PinoLogger } from 'nestjs-pino'
import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { isEmpty, isNil } from 'lodash'

import { ICount, IQuery } from '../commons/commons.interface'
import { IUsersService } from './users.interface'

import { User } from './user.model'
import { UserDto } from './user.dto'
import { FindAndCountOptions, FindOptions } from 'sequelize'

const { map } = Aigle

@Controller()
export class UsersController {
  constructor(@Inject('UsersService') private readonly service: IUsersService, private readonly logger: PinoLogger) {
    logger.setContext(UsersController.name)
  }

  @GrpcMethod('UsersService', 'find')
  async find(query: IQuery): Promise<{ rows: User[]; pageInfo: ICount }> {
    this.logger.warn('UsersController#findAll.call %o', query)

    const results = await this.service.find({
      attributes: !isEmpty(query.select) ? ['id'].concat(query.select) : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.orderBy) ? query.orderBy : undefined,
      limit: !isNil(query.limit) ? query.limit : 25,
      offset: !isEmpty(query.offset) ? query.offset : 0
    })

    this.logger.warn('UsersController#findAll.result %o', results)

    return results
  }

  @GrpcMethod('UsersService', 'findById')
  async findById({ id }): Promise<User> {
    this.logger.warn('UsersController#findById.call %o', id)

    const result: User = await this.service.findById(id)

    this.logger.warn('UsersController#findById.result %o', result)

    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('UsersService', 'findOne')
  async findOne(query: IQuery): Promise<User> {
    this.logger.warn('UsersController#findOne.call %o', query)

    const result: User = await this.service.findOne({
      attributes: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.warn('UsersController#findOne.result %o', result)

    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('UsersService', 'count')
  async count(query: IQuery): Promise<ICount> {
    this.logger.warn('UsersController#count.call %o', query)

    const count: number = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.warn('UsersController#count.result %o', count)

    return { count }
  }

  @GrpcMethod('UsersService', 'create')
  async create(data: UserDto): Promise<User> {
    this.logger.warn('UsersController#create.call %o', data)

    const result: User = await this.service.create(data)

    this.logger.warn('UsersController#create.result %o', result)

    return result
  }

  @GrpcMethod('UsersService', 'update')
  async update({ id, data }): Promise<User> {
    this.logger.warn('UsersController#update.call %o %o', id, data)

    const result: User = await this.service.update(id, data)

    this.logger.warn('UsersController#update.result %o', result)

    return result
  }

  @GrpcMethod('UsersService', 'destroy')
  async destroy(query: IQuery): Promise<ICount> {
    this.logger.warn('UsersController#destroy.call %o', query)

    const count: number = await this.service.destroy({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.warn('UsersController#destroy.result %o', count)

    return { count }
  }
}
