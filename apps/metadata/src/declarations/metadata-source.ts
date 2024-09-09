import type Emittery from 'emittery'
import type { Metadata } from '@project-maps/proto/metadata'
import type { Geospatial } from '@project-maps/proto/lib/geospatial'

export type Events = {
  item: Metadata.AreaMetadataItem
  end: undefined
}

export abstract class MetadataSource {
  abstract handlesLocation(location: ReturnType<typeof Geospatial.Coordinates['toObject']>): boolean

  abstract getAreaMetadata(request: Metadata.GetAreaMetadataInput, events: Emittery<Events>): void | Promise<void>
}
