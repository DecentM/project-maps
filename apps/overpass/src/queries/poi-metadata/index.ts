import path from 'node:path'
import { query } from 'src/declarations/query'

export type Params = {
  ids: number[]
  tags: string[]
}

export const create = query<Params>({
  path: path.resolve(import.meta.dirname, 'query.overpassql'),
})
