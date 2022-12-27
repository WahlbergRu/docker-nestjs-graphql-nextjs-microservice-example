import { FindOptions } from 'sequelize'

import { Post } from './post.model'
import { PostDto } from './post.dto'

export interface IPostUpdateInput {
  id: string
  data: PostDto
}

export interface ICount {
  count: number
}

export interface IPostsService {
  find(query?: FindOptions): Promise<{ rows: Post[]; pageInfo: ICount }>
  findById(id: string): Promise<Post>
  findOne(query?: FindOptions): Promise<Post>
  count(query?: FindOptions): Promise<number>
  create(post: PostDto): Promise<Post>
  update(id: string, post: PostDto): Promise<Post>
  destroy(query?: FindOptions): Promise<number>
}
