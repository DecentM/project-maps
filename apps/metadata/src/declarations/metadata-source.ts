import type Emittery from 'emittery'
import type { MetadataItem } from '@project-maps/proto/metadata/node'
import type { MetadataBusGetPoiMetadataInput } from 'src/metadata-bus'

export type Events = {
  osm: MetadataBusGetPoiMetadataInput
  start: undefined
  stop: undefined
  metadata: MetadataItem
}

type StopFunction = () => void

export abstract class MetadataSource {
  abstract listen(events: Emittery<Events>): StopFunction
}
