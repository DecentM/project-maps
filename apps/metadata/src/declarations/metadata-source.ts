import type Emittery from 'emittery'
import type {
  GetAreaMetadataInput,
  GetPoiMetadataInput,
  MetadataItem,
} from '@project-maps/proto/metadata/node'
import type { Coordinates } from '@project-maps/proto/lib/geospatial/node'

export type Events = {
  item: MetadataItem
}

export abstract class MetadataSource {
  abstract handlesLocation(location: ReturnType<(typeof Coordinates)['toObject']>): boolean

  abstract getAreaMetadata(request: GetAreaMetadataInput, events: Emittery<Events>): Promise<void>

  abstract getPoiMetadata(request: GetPoiMetadataInput, events: Emittery<Events>): Promise<void>
}
