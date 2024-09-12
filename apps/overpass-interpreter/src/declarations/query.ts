import fs from 'node:fs'
import { flattenObject } from 'src/lib/keyed-flatten'

type Query = {
  path: string
}

export const query = <Params extends Record<string, unknown>>(query: Query) => {
  const file = fs.readFileSync(query.path, 'utf-8') // Sync is fine here because this runs once at startup
  const contents = file.toString()

  return (input: Params) => {
    if (!input.tags || !Array.isArray(input.tags) || input.tags.length === 0) throw new Error('No tags provided')

    let interpolatedQuery = contents
    const flatInput = flattenObject(input)

    for (const key in flatInput) {
      interpolatedQuery = interpolatedQuery.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
        String(flatInput[key])
      )
    }

    return interpolatedQuery
  }
}
