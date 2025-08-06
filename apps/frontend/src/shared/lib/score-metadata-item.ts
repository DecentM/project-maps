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

  switch (item.item.case) {
    case 'image':
      good(item.attribution?.source === Attribution_Source.Wikidata)
      bad(item.attribution?.source === Attribution_Source.Mapillary) // Mapillary is global, we should prefer local sources
      bad(item.attribution?.source === Attribution_Source.Unknown)
    default:
      good(item.attribution?.source === Attribution_Source.Wikidata)
      bad(item.attribution?.source === Attribution_Source.Unknown)
  }

  return points
}

export const sortMetadataItems = (items: Array<MetadataItem>): Array<MetadataItem> => {
  return items
    .map((item) => ({ item, score: getRawScore(item) }))
    .sort((a, b) => a.score - b.score)
    .map((item) => item.item)
}
