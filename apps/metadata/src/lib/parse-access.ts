import { Access } from '@project-maps/proto/lib/openstreetmap/node'

export const parseAccess = (access?: string | null): Access => {
  switch (access) {
    case 'yes':
    case 'designated':
      return Access.ACCESS_PUBLIC
    case 'permissive':
    case 'customers':
    case 'destination':
    case 'agricultural':
    case 'forestry':
    case 'discouraged':
    case 'delivery':
    case 'permit':
      return Access.ACCESS_PERMISSIVE
    case 'no':
    case 'private':
    case 'military':
      return Access.ACCESS_PRIVATE
    default:
      return Access.ACCESS_UNSPECIFIED
  }
}
