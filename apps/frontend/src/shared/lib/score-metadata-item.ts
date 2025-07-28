import { Attribution_Source, type MetadataItem } from '@project-maps/proto/metadata/web'

const getRawScore = (item: MetadataItem): number => {
  let points = 0

  const good = (bool: unknown) => {
    if (bool) points += 1
  }

  const bad = (bool: unknown) => {
    if (bool) points -= 1
  }

  good(item.attribution)

  bad(item.attribution?.source === Attribution_Source.Unknown) // Unknown source
  bad(item.attribution?.source === Attribution_Source.Mapillary) // Mapillary - global, so we should prefer local sources
  bad(item.attribution?.source === Attribution_Source.OpenStreetMap) // OSM - global

  good(item.attribution?.source === Attribution_Source.Wikidata) // Wikidata

  return points
}

export const sortMetadataItems = (items: Array<MetadataItem>): Array<MetadataItem> => {
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
