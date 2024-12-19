import type Emittery from 'emittery'
import type {
  GetAreaMetadataInput,
  GetPoiMetadataInput,
  MetadataItem,
} from '@project-maps/proto/metadata'
import type { Coordinates } from '@project-maps/proto/lib/geospatial'

export type Events = {
  item: MetadataItem
  end: undefined
}

export abstract class MetadataSource {
  abstract handlesLocation(location: ReturnType<(typeof Coordinates)['toObject']>): boolean

  abstract getAreaMetadata(
    request: GetAreaMetadataInput,
    events: Emittery<Events>
  ): void | Promise<void>

  abstract getPoiMetadata(
    request: GetPoiMetadataInput,
    events: Emittery<Events>
  ): void | Promise<void>
}
