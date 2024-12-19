import VError from 'verror'
import {
  OverpassClient as GRPCOverpassClient,
  type QueryParameters,
  type PoiMetadataParameters,
} from '@project-maps/proto/overpass/node'
import { log } from '@project-maps/logging'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export class OverpassClient {
  private client = new GRPCOverpassClient(
    `${config.clients.overpassInterpreter.host}:${config.clients.overpassInterpreter.port}`,
    credentials.createInsecure()
  )

  public ShortRangeNamed(params: QueryParameters) {
    log.trace({ params: params.toObject() }, 'OverpassClient.ShortRangeNamed')

    const stream = this.client.ShortRangeNamed(params)

    stream.on('error', (error) => {
      log.error(new VError(error, 'OverpassClient.ShortRangeNamed'))
    })

    return stream
  }

  public WikidataIdsInRange(params: QueryParameters) {
    log.trace({ params: params.toObject() }, 'OverpassClient.WikidataIdsInRange')

    const stream = this.client.WikidataIdsInRange(params)

    stream.on('error', (error) => {
      log.error(new VError(error, 'OverpassClient.WikidataIdsInRange'))
    })

    return stream
  }

  public PoiMetadata(params: PoiMetadataParameters) {
    log.trace({ params: params.toObject() }, 'OverpassClient.GetPoiMetadata')

    const stream = this.client.PoiMetadata(params)

    stream.on('error', (error) => {
      log.error(new VError(error, 'OverpassClient.GetPoiMetadata'))
    })

    return stream
  }

  public PoiWikidataId(params: PoiMetadataParameters) {
    log.trace({ params: params.toObject() }, 'OverpassClient.GetPoiWikidataId')

    const stream = this.client.PoiWikidataId(params)

    stream.on('error', (error) => {
      log.error(new VError(error, 'OverpassClient.GetPoiWikidataId'))
    })

    return stream
  }
}
