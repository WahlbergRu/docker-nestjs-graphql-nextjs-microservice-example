export interface Iid {
  id: string
}

export interface IQuery {
  select?: string[]
  where?: string
  orderBy?: string[]
  limit?: number
  offset?: number
}

export interface ICount {
  count: number
}
