import { Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Resolver, Parent, ResolveField } from '@nestjs/graphql'
import { lastValueFrom } from 'rxjs'

import { PinoLogger } from 'nestjs-pino'

import { CommentDto } from './comment.dto'
import { IPostsService } from '../posts/posts.interface'
import { IUsersService } from '../users/users.interface'
import { Post, User } from '../graphql/typings'

@Resolver('Comment')
export class CommentsTypeResolver implements OnModuleInit {
  constructor(
    @Inject('PostsServiceClient')
    private readonly postsServiceClient: ClientGrpcProxy,

    @Inject('UsersServiceClient')
    private readonly usersServiceClient: ClientGrpcProxy,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(CommentsTypeResolver.name)
  }

  private postsService: IPostsService

  private usersService: IUsersService

  onModuleInit(): void {
    this.postsService = this.postsServiceClient.getService<IPostsService>('PostsService')
    this.usersService = this.usersServiceClient.getService<IUsersService>('UsersService')
  }

  @ResolveField('author')
  async getAuthor(@Parent() comment: CommentDto): Promise<User> {
    return await lastValueFrom(
      this.usersService.findById({
        id: comment.author
      })
    )
  }

  @ResolveField('post')
  async getPost(@Parent() comment: CommentDto): Promise<Post> {
    return await lastValueFrom(
      this.postsService.findById({
        id: comment.post
      })
    )
  }
}
