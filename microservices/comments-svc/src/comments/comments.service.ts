import { isEmpty } from 'lodash'
import { PinoLogger } from 'nestjs-pino'
import { Injectable } from '@nestjs/common'
import { FindAndCountOptions, FindOptions } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'

import { ICommentsService } from './comments.interface'

import { Comment } from './comment.model'
import { CommentDto } from './comment.dto'

@Injectable()
export class CommentsService implements ICommentsService {
  private readonly logger = new PinoLogger({ renameContext: CommentsService.name })
  constructor(
    @InjectModel(Comment)
    private readonly repo: typeof Comment
  ) {}

  async find(query?: FindAndCountOptions): Promise<FindAndCountOptions<Comment>> {
    this.logger.warn('CommentsService#findAll.call %o', query)

    // @ts-ignore
    const result: FindAndCountOptions<Comment> = await this.repo.findAndPaginate({
      ...query,
      raw: true,
      paranoid: false
    })

    this.logger.warn('CommentsService#findAll.result %o', result)

    return result
  }

  async findById(id: string): Promise<Comment> {
    this.logger.warn('CommentsService#findById.call %o', id)

    const result: Comment = await this.repo.findByPk(id, {
      raw: true
    })

    this.logger.warn('CommentsService#findById.result %o', result)

    return result
  }

  async findOne(query: FindOptions): Promise<Comment> {
    this.logger.warn('CommentsService#findOne.call %o', query)

    const result: Comment = await this.repo.findOne({
      ...query,
      raw: true
    })

    this.logger.warn('CommentsService#findOne.result %o', result)

    return result
  }

  async count(query?: FindOptions): Promise<number> {
    this.logger.warn('CommentsService#count.call %o', query)

    const result: number = await this.repo.count(query)

    this.logger.warn('CommentsService#count.result %o', result)

    return result
  }

  async create(commentDto: CommentDto): Promise<Comment> {
    this.logger.warn('CommentsService#create.call %o', commentDto)

    const result: Comment = await this.repo.create(commentDto)

    this.logger.warn('CommentsService#create.result %o', result)

    return result
  }

  async update(id: string, comment: CommentDto): Promise<Comment> {
    this.logger.warn('CommentsService#update.call %o', comment)

    const record: Comment = await this.repo.findByPk(id)

    if (isEmpty(record)) throw new Error('Record not found.')

    const result: Comment = await record.update(comment)

    this.logger.warn('CommentsService#update.result %o', result)

    return result
  }

  async destroy(query?: FindOptions): Promise<number> {
    this.logger.warn('CommentsService#destroy.call %o', query)

    const result: number = await this.repo.destroy(query)

    this.logger.warn('CommentsService#destroy.result %o', result)

    return result
  }
}
