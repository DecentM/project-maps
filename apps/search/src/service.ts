import type { ServerWritableStream } from '@grpc/grpc-js'
import {
  UnimplementedSearchService,
  SearchResult,
  type QueryParameters,
} from '@project-maps/proto/search/node'

import { MeilisearchClient } from './clients/meilisearch'
import { MemberType } from '@project-maps/proto/lib/openstreetmap'

export class SearchService extends UnimplementedSearchService {
  private static client = new MeilisearchClient()

  override async Query(call: ServerWritableStream<QueryParameters, SearchResult>): Promise<void> {
    const geoNodesResults = await SearchService.client.search('geo-nodes', call.request.query)

    for (const result of geoNodesResults.hits) {
      call.write(
        SearchResult.fromObject({
          type: MemberType.NODE,
          id: result.id,
        })
      )
    }

    // const nodesResults = await SearchService.client.search('nodes', call.request.query)

    // for (const result of nodesResults.hits) {
    //   call.write(
    //     Search.SearchResult.fromObject({
    //       type: OpenStreetMap.Member.Type.NODE,
    //       id: result.id,
    //     })
    //   )
    // }

    // const waysResults = await SearchService.client.search('ways', call.request.query)

    // for (const result of waysResults.hits) {
    //   call.write(
    //     Search.SearchResult.fromObject({
    //       type: OpenStreetMap.Member.Type.WAY,
    //       id: result.id,
    //     })
    //   )
    // }

    // const relationsResults = await SearchService.client.search('relations', call.request.query)

    // for (const result of relationsResults.hits) {
    //   call.write(
    //     Search.SearchResult.fromObject({
    //       type: OpenStreetMap.Member.Type.RELATION,
    //       id: result.id,
    //     })
    //   )
    // }

    call.end()
  }
}
