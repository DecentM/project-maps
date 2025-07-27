import { Metadata } from '@project-maps/proto/metadata/web'
import { Overpass } from '@project-maps/proto/overpass/web'
import { Search } from '@project-maps/proto/search/web'

import { createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'

const createTransport = (prefix: string) => {
  return createGrpcWebTransport({
    baseUrl: `${process.env.WEB_BACKEND_URL}/${prefix}`,
    useBinaryFormat: true,
    fetch: (i, init) => fetch(i, { ...init, credentials: 'include' }),
  })
}

export const metadataClient = createClient(Metadata, createTransport('metadata'))
export const overpassClient = createClient(Overpass, createTransport('overpass'))
export const searchClient = createClient(Search, createTransport('search'))
