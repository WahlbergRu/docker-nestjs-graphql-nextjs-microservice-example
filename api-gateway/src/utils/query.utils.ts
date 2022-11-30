import { isEmpty, isNil, merge } from 'lodash'
import { Injectable } from '@nestjs/common'

import { IQuery } from '../commons/commons.interface'

@Injectable()
export class QueryUtils {
  async getFilters(filterBy: Record<string, any>): Promise<Record<string, any>> {
    const queryFilters = { where: {} }

    if (!isEmpty(filterBy)) Object.assign(queryFilters.where, filterBy)

    return queryFilters
  }

  async getOrder(orderBy: string): Promise<IQuery> {
    const queryOrder: IQuery = {}

    if (!isEmpty(orderBy)) {
      if (orderBy.trim().charAt(0) === '-') {
        Object.assign(queryOrder, { orderBy: [orderBy.trim().substring(1, 2), 'DESC'] })
      } else {
        Object.assign(queryOrder, { orderBy: [orderBy.trim(), 'ASC'] })
      }
    }

    return queryOrder
  }

  // TODO: delete?
  async getCursor(limit: number, offset: number): Promise<IQuery> {
    const queryCursor: IQuery = {}

    return Object.assign(queryCursor, { limit, offset })
  }

  async buildQuery(filterBy: Record<string, any>, orderBy: string, limit: number, offset: number): Promise<IQuery> {
    return merge({}, await this.getFilters(filterBy), await this.getOrder(orderBy), await this.getCursor(limit, offset))
  }
}
