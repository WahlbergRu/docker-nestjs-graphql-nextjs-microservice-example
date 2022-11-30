import Aigle from 'aigle'

import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { Metadata } from '@grpc/grpc-js'
import { PinoLogger } from 'nestjs-pino'
import { get, isEmpty, isNil } from 'lodash'

import { ICount, IQuery } from '../commons/commons.interface'
import { IPostsService, IPostUpdateInput } from './posts.interface'

import { Post } from './post.model'
import { PostDto } from './post.dto'
import { FindAndCountOptions, FindOptions } from 'sequelize/types';

const { map } = Aigle

@Controller()
export class PostsController {
  constructor(
    @Inject('PostsService')
    private readonly service: IPostsService,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(PostsController.name)
  }

  @GrpcMethod('PostsService', 'find')
  async find(query: IQuery): Promise<FindAndCountOptions<Post>> {
    this.logger.info('PostsController#findAll.call %o', query)

    const result = await this.service.find({
      attributes: !isEmpty(query.select) ? ['id'].concat(query.select) : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.orderBy) ? query.orderBy : undefined,
      limit: !isNil(query.limit) ? query.limit : 25,
      offset: !isNil(query.limit) ? query.offset : 25,
    })

    this.logger.info('PostsController#findAll.result %o', result)

    return result
  }

  @GrpcMethod('PostsService', 'findById')
  async findById({ id }): Promise<Post> {
    this.logger.info('PostsController#findById.call %o', id)

    const result: Post = await this.service.findById(id)

    this.logger.info('PostsController#findById.result %o', result)

    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('PostsService', 'findOne')
  async findOne(query: IQuery): Promise<Post> {
    this.logger.info('PostsController#findOne.call %o', query)

    const result: Post = await this.service.findOne({
      attributes: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('PostsController#findOne.result %o', result)

    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('PostsService', 'count')
  async count(query: IQuery): Promise<ICount> {
    this.logger.info('PostsController#count.call %o', query)

    const count: number = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('PostsController#count.result %o', count)

    return { count }
  }

  @GrpcMethod('PostsService', 'create')
  async create(data: PostDto): Promise<Post> {
    this.logger.info('PostsController#create.call %o', data)

    const result: Post = await this.service.create(data)

    this.logger.info('PostsController#create.result %o', result)

    return result
  }

  @GrpcMethod('PostsService', 'update')
  async update(input: IPostUpdateInput, metadata: Metadata): Promise<Post> {
    this.logger.info('PostsController#update.call %o %o', input, metadata.getMap())

    const { id, data } = input
    const user: string = get(metadata.getMap(), 'user', '').toString()
    const post: Post = await this.service.findById(id)

    if (isEmpty(post)) throw new Error(`Post record with ID ${id} not found.`)

    if (post.author !== user) throw new Error('You are not allowed to modify this post.')

    const result: Post = await this.service.update(id, data)

    this.logger.info('PostsController#update.result %o', result)

    return result
  }

  @GrpcMethod('PostsService', 'destroy')
  async destroy(query: IQuery): Promise<ICount> {
    this.logger.info('PostsController#destroy.call %o', query)

    const count: number = await this.service.destroy({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('PostsController#destroy.result %o', count)

    return { count }
  }
}
