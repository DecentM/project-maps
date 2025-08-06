import Emittery from 'emittery'
import type { ServerWritableStream } from '@grpc/grpc-js'

import { log } from '@project-maps/logging'
import {
  type GetPoiMetadataInput,
  type MetadataItem,
  type GetAreaMetadataInput,
  UnimplementedMetadataService,
} from '@project-maps/proto/metadata/node'

import type { Events } from 'src/declarations/metadata-source'

import { MetadataBus } from './metadata-bus'

export class MetadataService extends UnimplementedMetadataService {
  override GetAreaMetadata(call: ServerWritableStream<GetAreaMetadataInput, MetadataItem>): void {
    log.warn('MetadataService.GetAreaMetadata: This method is not implemented')
    call.end()
  }

  override async GetPoiMetadata(
    call: ServerWritableStream<GetPoiMetadataInput, MetadataItem>
  ): Promise<void> {
    const bus = new MetadataBus()
    const emitter = new Emittery<Events>()

    emitter.on('metadata', (item: MetadataItem) => {
      call.write(item)
    })

    await bus.getPoiMetadata(call.request, emitter)

    call.end()
  }
}
