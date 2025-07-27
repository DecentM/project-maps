import type { ServerWritableStream } from '@grpc/grpc-js'
import {
  UnimplementedSearchService,
  SearchResult,
  type QueryParameters,
} from '@project-maps/proto/search/node'

import { MemberType } from '@project-maps/proto/lib/openstreetmap/node'

import { NominatimClient } from './clients/nominatim'
export class SearchService extends UnimplementedSearchService {
  private static nominatim = new NominatimClient()

  override async Query(call: ServerWritableStream<QueryParameters, SearchResult>): Promise<void> {
    const results = await SearchService.nominatim.search({
      q: call.request.query,
      addressdetails: 1,
      'accept-language': 'en', // TODO: i18n
    })

    for (const result of results) {
      call.write(
        SearchResult.fromObject({
          id: result.osm_id,
          coordinates: {
            lat: Number.parseFloat(result.lat),
            lng: Number.parseFloat(result.lng),
          },
          name: result.name,
          // 3-way between node, way, and relation
          type:
            result.osm_type === 'node'
              ? MemberType.MEMBER_TYPE_NODE
              : result.osm_type === 'relation'
                ? MemberType.MEMBER_TYPE_RELATION
                : MemberType.MEMBER_TYPE_WAY,
          address: result.address,
        })
      )
    }

    call.end()
  }
}
