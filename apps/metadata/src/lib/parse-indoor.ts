import { Indoor } from '@project-maps/proto/lib/openstreetmap/node'

export const parseIndoor = (indoor?: string | null): Indoor => {
  switch (indoor) {
    case 'yes':
      return Indoor.INDOOR_YES
    case 'no':
      return Indoor.INDOOR_NO
    case 'room':
      return Indoor.INDOOR_ROOM
    case 'area':
      return Indoor.INDOOR_AREA
    case 'wall':
      return Indoor.INDOOR_WALL
    case 'corridor':
      return Indoor.INDOOR_CORRIDOR
    case 'door':
      return Indoor.INDOOR_DOOR
    case 'level':
      return Indoor.INDOOR_LEVEL
    case 'column':
      return Indoor.INDOOR_COLUMN
    default:
      return Indoor.INDOOR_UNSPECIFIED
  }
}
