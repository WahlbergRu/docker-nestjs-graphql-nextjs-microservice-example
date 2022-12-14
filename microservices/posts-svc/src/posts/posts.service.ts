import { PageInfo } from './../../../../api-gateway/dist/graphql/typings.d'
import { isEmpty } from 'lodash'
import { PinoLogger } from 'nestjs-pino'
import { Injectable } from '@nestjs/common'
import { FindAndCountOptions, FindOptions, GroupedCountResultItem } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'

import { ICount, IPostsService } from './posts.interface'

import { Post } from './post.model'
import { PostDto } from './post.dto'
import { Sequelize } from 'sequelize-typescript'
// import { IFindAndPaginateResult } from '../commons/commons.interface'

@Injectable()
export class PostsService implements IPostsService {
  private readonly logger = new PinoLogger({ renameContext: PostsService.name })
  constructor(@InjectModel(Post) private readonly repo: typeof Post) {}

  async find(query?: FindAndCountOptions): Promise<{ rows: Post[]; pageInfo: ICount }> {
    this.logger.info('PostsService#findAll.call %o', query)

    // @ts-ignore
    const result: { rows: Post[]; count: number; pageInfo: ICount } = await this.repo.findAndCountAll({
      ...query,
      paranoid: false
    })

    result.pageInfo = { count: result.count }

    this.logger.info('PostsService#findAll.result %o', result)

    return result
  }

  async findById(id: string): Promise<Post> {
    this.logger.info('PostsService#findById.call %o', id)

    const result: Post = await this.repo.findByPk(id, {
      raw: true
    })

    this.logger.info('PostsService#findById.result %o', result)

    return result
  }

  async findOne(query: FindOptions): Promise<Post> {
    this.logger.info('PostsService#findOne.call %o', query)

    const result: Post = await this.repo.findOne({
      ...query,
      raw: true
    })

    this.logger.info('PostsService#findOne.result %o', result)

    return result
  }

  async count(query?: FindOptions): Promise<number> {
    this.logger.info('PostsService#count.call %o', query)

    const result: number = await this.repo.count(query)

    this.logger.info('PostsService#count.result %o', result)

    return result
  }

  async create(commentDto: PostDto): Promise<Post> {
    this.logger.info('PostsService#create.call %o', commentDto)

    const result: Post = await this.repo.create(commentDto)

    this.logger.info('PostsService#create.result %o', result)

    return result
  }

  async update(id: string, comment: PostDto): Promise<Post> {
    this.logger.info('PostsService#update.call %o', comment)

    const record: Post = await this.repo.findByPk(id)

    if (isEmpty(record)) throw new Error('Record not found.')

    const result: Post = await record.update(comment)

    this.logger.info('PostsService#update.result %o', result)

    return result
  }

  async destroy(query?: FindOptions): Promise<number> {
    this.logger.info('PostsService#destroy.call %o', query)

    const result: number = await this.repo.destroy(query)

    this.logger.info('PostsService#destroy.result %o', result)

    return result
  }
}
