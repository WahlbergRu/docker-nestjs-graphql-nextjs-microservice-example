import { FindOptions } from 'sequelize'

import { Comment } from './comment.model'
import { CommentDto } from './comment.dto'
import { ICount } from '../commons/commons.interface'

export interface ICommentUpdateInput {
  id: string
  data: CommentDto
}

export interface ICommentsService {
  find(query?: FindOptions): Promise<{ rows: Comment[]; pageInfo: ICount }>
  findById(id: string): Promise<Comment>
  findOne(query?: FindOptions): Promise<Comment>
  count(query?: FindOptions): Promise<number>
  create(comment: CommentDto): Promise<Comment>
  update(id: string, comment: CommentDto): Promise<Comment>
  destroy(query?: FindOptions): Promise<number>
}
