import type Emittery from 'emittery'
import type { GetPoiMetadataInput, MetadataItem } from '@project-maps/proto/metadata/node'

export type Events = {
  osm: GetPoiMetadataInput
  start: undefined
  stop: undefined
  metadata: MetadataItem
}

type StopFunction = () => void

export abstract class MetadataSource {
  abstract listen(events: Emittery<Events>): StopFunction
}
