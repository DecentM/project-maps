import type { Metadata } from '@project-maps/proto/metadata'

const getRawScore = (item: ReturnType<Metadata.MetadataItem['toObject']>): number => {
  let points = 0

  const good = (bool: unknown) => {
    if (bool) points += 1
  }

  const bad = (bool: unknown) => {
    if (bool) points -= 1
  }

  good(item.attribution)

  bad(item.attribution?.source === 0) // Unknown source
  bad(item.attribution?.source === 2) // Mapillary - global, so we should prefer local sources
  bad(item.attribution?.source === 8) // OSM - global

  good(item.attribution?.source === 7) // Wikidata

  return points
}

const getMetadataType = (item: ReturnType<Metadata.MetadataItem['toObject']>): string => {
  if ('image' in item) return 'image'
  if ('metadata' in item) return 'metadata'
  if ('company' in item) return 'company'
  if ('description' in item) return 'description'
  if ('coordinates' in item) return 'coordinates'

  return 'unknown'
}

export const sortMetadataItems = (
  items: Array<ReturnType<Metadata.MetadataItem['toObject']>>
): Array<ReturnType<Metadata.MetadataItem['toObject']>> => {
  const result: number[] = []

  let maxPoints = 0
  let minPoints = 0

  // Two step process, because we need to know the extremities before we can normalise
  for (const item of items) {
    const rawScore = getRawScore(item)

    maxPoints = Math.min(maxPoints ?? rawScore, rawScore)
    minPoints = Math.max(minPoints ?? rawScore, rawScore)
  }

  for (const item of items) {
    const rawScore = getRawScore(item)

    result.push((rawScore - minPoints) / (maxPoints - minPoints || 0.001)) // Avoid division by zero
  }

  const seen = new Set<string>()

  const mapped = items
    .map((item, index) => ({ item, score: result[index] }))
    .sort((a, b) => a.score - b.score)
    .filter((item) => {
      const type = getMetadataType(item.item)
      if (seen.has(type)) return false
      seen.add(type)
      return true
    })
    .map((item) => item.item)

  return mapped
}
