import { log } from '@project-maps/logging'
import parseOSM from 'osm-pbf-parser'
import through from 'through2'

import { config } from './config'
import got from 'got'
import { MeilisearchClient } from './clients/meilisearch'

const MAX_BATCH_SIZE = 100 * 1024 * 1024 // 100 MB in bytes

export class App {
  private client = new MeilisearchClient()

  public async createIndex() {
    const indexName = 'nodes'
    const index = await this.client.findOneIndex(indexName)

    if (index && !config.recreateIndex) {
      log.info('Index already exists, skipping', { indexName })
      return
    }

    log.info('Recreating index', { indexName })
    await this.client.deleteIndex(indexName)

    log.debug('Creating index', { indexName })
    await this.client.createIndex(indexName)

    const osm = parseOSM()
    const stream = got.stream(config.indexPbfUrl)

    let batch: Array<Record<string, unknown>> = []
    let batchSize = 0
    let processedCount = 0

    const sendBatch = async () => {
      log.debug({ batchSize, processedCount }, 'Sending batch and indexing')
      await this.client.addDocuments(indexName, batch)

      batch = []
      batchSize = 0
    }

    stream.pipe(osm).pipe(
      through.obj(async (items, enc, next) => {
        for (const item of items) {
          processedCount++

          if (
            !item.tags?.name &&
            !item.tags?.name_int &&
            !item.tags?.['name:latin'] &&
            !item.tags?.['name:en']
          ) {
            continue
          }

          batchSize += JSON.stringify(item).length + 3 // 3 bytes for braces and comma
          batch.push({
            id: item.id,
            type: item.type,
            name: item.tags?.name,
            name_int: item.tags?.name_int,
            name_en: item.tags?.['name:en'],
            name_latin: item.tags?.['name:latin'],
            highway: item.tags?.highway,
            public_transport: item.tags?.public_transport,
            crossing_ref: item.tags?.crossing_ref,
            crossing: item.tags?.crossing,
            rcn_name: item.tags?.rcn_name,
            amenity: item.tags?.amenity,
            bicycle_rental: item.tags?.bicycle_rental,
            brand: item.tags?.brand,
            brand_wikidata: item.tags?.['brand:wikidata'],
            network: item.tags?.network,
            operator: item.tags?.operator,
            operator_wikidata: item.tags?.['operator:wikidata'],
            official_name: item.tags?.official_name,
            local: item.tags?.local,
            addr_city: item.tags?.['addr:city'],
            addr_street: item.tags?.['addr:street'],
            addr_housenumber: item.tags?.['addr:housenumber'],
            addr_postcode: item.tags?.['addr:postcode'],
            addr_country: item.tags?.['addr:country'],
            addr_housename: item.tags?.['addr:housename'],
            addr_place: item.tags?.['addr:place'],
            addr_full: item.tags?.['addr:full'],
            addr_state: item.tags?.['addr:state'],
            addr_county: item.tags?.['addr:county'],
            wikipedia: item.tags?.wikipedia,
            wikidata: item.tags?.wikidata,
            office: item.tags?.office,
            building: item.tags?.building,
            alt_name: item.tags?.alt_name,
            phone: item.tags?.phone,
            website: item.tags?.website,
          })

          if (batchSize >= MAX_BATCH_SIZE - 5) { // 5 bytes for braces and commas
            await sendBatch()
          }
        }

        next()
      })
    )

    stream.once('end', async () => {
      if (batch.length > 0) {
        await sendBatch()
      }

      log.info('Indexing complete')
    })
  }
}
