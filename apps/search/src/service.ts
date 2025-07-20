import type { ServerWritableStream } from '@grpc/grpc-js'
import {
  UnimplementedSearchService,
  SearchResult,
  type QueryParameters,
} from '@project-maps/proto/search/node'

import { MeilisearchClient } from './clients/meilisearch'
import { MemberType } from '@project-maps/proto/lib/openstreetmap/node'

const search = async (
  client: MeilisearchClient,
  indexName: string,
  memberType: MemberType,
  query: string,
  onResult: (result: SearchResult) => void
) => {
  const geoNodesResults = await client.search(indexName, query)

  for (const result of geoNodesResults.hits) {
    onResult(
      SearchResult.fromObject({
        type: memberType,
        id: result.id,
        name: result.name,
        coordinates: result._geo,
      })
    )
  }
}

export class SearchService extends UnimplementedSearchService {
  private static client = new MeilisearchClient()

  override async Query(call: ServerWritableStream<QueryParameters, SearchResult>): Promise<void> {
    await search(SearchService.client, 'nodes', MemberType.NODE, call.request.query, (result) =>
      call.write(result)
    )

    call.end()
  }
}
