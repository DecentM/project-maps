// TODO: Use enum instead of number, once the grpc readable issue was resolved
export const imageSourceString = (source: number): string => {
  switch (source) {
    case 0:
      return 'Geograph UK'
    case 1:
      return 'Mapillary'
    case 2:
      return 'Flickr'
    case 3:
      return 'Wikimedia Commons'
    case 4:
      return 'Geograph DE'
    default:
      return 'Unknown'
  }
}
