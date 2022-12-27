import { Inject, OnModuleInit, UseGuards } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Query, Resolver, Args, Context } from '@nestjs/graphql'
import { lastValueFrom } from 'rxjs'

import { isEmpty, merge } from 'lodash'
import { PinoLogger } from 'nestjs-pino'

import { IPostsService } from './posts.interface'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { Post, PostsConnection } from '../graphql/typings'

import { QueryUtils } from '../utils/query.utils'

@Resolver()
export class PostsQueryResolver implements OnModuleInit {
  constructor(
    @Inject('PostsServiceClient')
    private readonly postsServiceClient: ClientGrpcProxy,

    private readonly queryUtils: QueryUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(PostsQueryResolver.name)
  }

  private postsService: IPostsService

  onModuleInit(): void {
    this.postsService = this.postsServiceClient.getService<IPostsService>('PostsService')
  }

  @Query('posts')
  async getPosts(@Args('q') q: string, @Args('limit') limit: number, @Args('offset') offset: number, @Args('filterBy') filterBy: any, @Args('orderBy') orderBy: string): Promise<PostsConnection> {
    const query = { where: {} }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await this.queryUtils.buildQuery(filterBy, orderBy, limit, offset))

    return await lastValueFrom(
      this.postsService.find({
        ...query,
        where: JSON.stringify(query.where)
      })
    )
  }

  @Query('post')
  async getPost(@Args('id') id: string): Promise<Post> {
    return await lastValueFrom(this.postsService.findById({ id }))
  }

  @Query('postCount')
  async getPostCount(@Args('q') q: string, @Args('filterBy') filterBy: any): Promise<number> {
    const query = { where: {} }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await this.queryUtils.getFilters(filterBy))

    const { count } = await lastValueFrom(
      this.postsService.count({
        ...query,
        where: JSON.stringify(query.where)
      })
    )

    return count
  }

  @Query('myPosts')
  @UseGuards(GqlAuthGuard)
  async getMyPosts(
    @Context() context,
    @Args('q') q: string,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
    @Args('filterBy') filterBy: any,
    @Args('orderBy') orderBy: string
  ): Promise<PostsConnection> {
    this.logger.info('========USER %o', context.req.user)
    const query = { where: { author: context.req.user.id } }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await this.queryUtils.buildQuery(filterBy, orderBy, limit, offset))
    this.logger.info('========USER %o', query)

    return await lastValueFrom(
      this.postsService.find({
        ...query,
        where: JSON.stringify(query.where)
      })
    )
  }
}
