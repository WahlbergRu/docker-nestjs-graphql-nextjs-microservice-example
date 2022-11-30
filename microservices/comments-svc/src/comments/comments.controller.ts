import Aigle from 'aigle'

import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { Metadata } from '@grpc/grpc-js'
import { PinoLogger } from 'nestjs-pino'
import { get, isEmpty, isNil } from 'lodash'

import { ICount, IQuery } from '../commons/commons.interface'
import { ICommentsService, ICommentUpdateInput } from './comments.interface'

import { Comment } from './comment.model'
import { CommentDto } from './comment.dto'
import { FindOptions } from 'sequelize/types';

const { map } = Aigle

@Controller()
export class CommentsController {
  constructor(
    @Inject('CommentsService')
    private readonly service: ICommentsService,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(CommentsController.name)
  }

  @GrpcMethod('CommentsService', 'find')
  async find(query: IQuery): Promise<FindOptions<Comment>> {
    this.logger.info('CommentsController#findAll.call %o', query)

    const results = this.service.find({
      attributes: !isEmpty(query.select) ? ['id'].concat(query.select) : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.orderBy) ? query.orderBy : undefined,
      limit: !isNil(query.limit) ? query.limit : 25,
      offset: !isNil(query.offset) ? query.limit : 25,
    })

    return results
  }

  @GrpcMethod('CommentsService', 'findById')
  async findById({ id }): Promise<Comment> {
    this.logger.info('CommentsController#findById.call %o', id)

    const result: Comment = await this.service.findById(id)

    this.logger.info('CommentsController#findById.result %o', result)

    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('CommentsService', 'findOne')
  async findOne(query: IQuery): Promise<Comment> {
    this.logger.info('CommentsController#findOne.call %o', query)

    const result: Comment = await this.service.findOne({
      attributes: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('CommentsController#findOne.result %o', result)

    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('CommentsService', 'count')
  async count(query: IQuery): Promise<ICount> {
    this.logger.info('CommentsController#count.call %o', query)

    const count: number = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('CommentsController#count.result %o', count)

    return { count }
  }

  @GrpcMethod('CommentsService', 'create')
  async create(data: CommentDto): Promise<Comment> {
    this.logger.info('CommentsController#create.call %o', data)

    const result: Comment = await this.service.create(data)

    this.logger.info('CommentsController#create.result %o', result)

    return result
  }

  @GrpcMethod('CommentsService', 'update')
  async update(input: ICommentUpdateInput, metadata: Metadata): Promise<Comment> {
    this.logger.info('CommentsController#update.call %o %o', input, metadata.getMap())

    const { id, data } = input
    const user: string = get(metadata.getMap(), 'user', '').toString()
    const comment: Comment = await this.service.findById(id)

    if (isEmpty(comment)) throw new Error(`Comment record with ID ${id} not found.`)

    if (comment.author !== user) throw new Error('You are not allowed to modify this comment.')

    const result: Comment = await this.service.update(id, data)

    this.logger.info('CommentsController#update.result %o', result)

    return result
  }

  @GrpcMethod('CommentsService', 'destroy')
  async destroy(query: IQuery): Promise<ICount> {
    this.logger.info('CommentsController#destroy.call %o', query)

    const count: number = await this.service.destroy({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('CommentsController#destroy.result %o', count)

    return { count }
  }
}