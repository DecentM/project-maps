import { Attribution_Source } from '@project-maps/proto/metadata/web'

export const imageSourceString = (source: Attribution_Source): string | undefined => {
  switch (source) {
    case Attribution_Source.GeographUK:
      return 'Geograph UK'
    case Attribution_Source.Mapillary:
      return 'Mapillary'
    case Attribution_Source.Wikimapia:
      return 'Wikimapia'
    case Attribution_Source.Wikidata:
      return 'Wikidata'
    case Attribution_Source.OpenStreetMap:
      return 'OpenStreetMap'
    case Attribution_Source.Website:
      return 'Web'
    default:
      return undefined
  }
}
