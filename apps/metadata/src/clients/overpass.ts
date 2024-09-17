import VError from 'verror'
import { Overpass } from '@project-maps/proto/overpass'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'
import { log } from '@project-maps/logging'

export class OverpassClient {
  private client = new Overpass.OverpassClient(
    `${config.clients.overpassInterpreter.host}:${config.clients.overpassInterpreter.port}`,
    credentials.createInsecure()
  )

  public ShortRangeNamed (params: Overpass.QueryParameters) {
    log.trace({ params }, 'OverpassClient.ShortRangeNamed')

    const stream = this.client.ShortRangeNamed(params)

    stream.on('error', (error) => {
      log.error(new VError(error, 'OverpassClient.ShortRangeNamed'))
    })

    return stream
  }

  public WikidataIdsInRange (params: Overpass.QueryParameters) {
    log.trace({ params }, 'OverpassClient.WikidataIdsInRange')

    const stream = this.client.WikidataIdsInRange(params)

    stream.on('error', (error) => {
      log.error(new VError(error, 'OverpassClient.WikidataIdsInRange'))
    })

    return stream
  }

  public PoiMetadata (params: Overpass.PoiMetadataParameters) {
    log.trace({ params }, 'OverpassClient.GetPoiMetadata')

    const stream = this.client.PoiMetadata(params)

    stream.on('error', (error) => {
      log.error(new VError(error, 'OverpassClient.GetPoiMetadata'))
    })

    return stream
  }

  public PoiWikidataId (params: Overpass.PoiMetadataParameters) {
    log.trace({ params }, 'OverpassClient.GetPoiWikidataId')

    const stream = this.client.PoiWikidataId(params)

    stream.on('error', (error) => {
      log.error(new VError(error, 'OverpassClient.GetPoiWikidataId'))
    })

    return stream
  }
}
