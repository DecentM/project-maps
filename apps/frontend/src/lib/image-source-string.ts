import type { Metadata } from '@project-maps/proto/metadata'

// TODO: Use enum instead of number, once the grpc readable issue was resolved
export const imageSourceString = (source: Metadata.Attribution.Source): string => {
  switch (source) {
    case 1:
      return 'Geograph UK'
    case 2:
      return 'Mapillary'
    case 3:
      return 'Flickr'
    case 4:
      return 'Wikimedia Commons'
    case 5:
      return 'Geograph DE'
    case 6:
      return 'Wikimapia'
    default:
      return 'Unknown'
  }
}
