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

  return items
    .map((item, index) => ({ item, score: result[index] }))
    .sort((a, b) => a.score - b.score)
    .map((item) => item.item)
}
