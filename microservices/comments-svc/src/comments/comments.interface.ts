import { FindAndCountOptions, FindOptions } from 'sequelize'

import { Comment } from './comment.model'
import { CommentDto } from './comment.dto'

export interface ICommentUpdateInput {
  id: string
  data: CommentDto
}

export interface ICommentsService {
  find(query?: FindAndCountOptions): Promise<FindAndCountOptions<Comment>>
  findById(id: string): Promise<Comment>
  findOne(query?: FindOptions): Promise<Comment>
  count(query?: FindOptions): Promise<number>
  create(comment: CommentDto): Promise<Comment>
  update(id: string, comment: CommentDto): Promise<Comment>
  destroy(query?: FindOptions): Promise<number>
}
