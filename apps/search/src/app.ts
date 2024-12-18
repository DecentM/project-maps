import { log } from '@project-maps/logging'
import parseOSM from 'osm-pbf-parser'
import through from 'through2'

import { config } from './config'
import got from 'got'
import { MeilisearchClient } from './clients/meilisearch'

class Batch {
  constructor(private indexName: string, private client: MeilisearchClient) {}

  private batch: Array<Record<string, unknown>> = []

  private batchSize = 0

  public add(item: Record<string, unknown>) {
    this.batch.push(item)
    this.batchSize += JSON.stringify(item).length * 2 // 2 bytes per character

    return this.batchSize
  }

  public getSize() {
    return this.batchSize
  }

  private clear() {
    this.batch = []
    this.batchSize = 0
  }

  public async send() {
    log.debug({ size: this.batchSize }, `Sending batch "${this.indexName}" and indexing`)

    const task = await this.client.addDocuments(this.indexName, this.batch)
    this.clear()

    return task
  }
}

class App {
  private client = new MeilisearchClient()

  public async createIndex() {
    if (!config.recreateIndex) {
      log.info('Skipping index recreation')
      return
    }

    log.info('Recreating indexes')
    for (const index of ['nodes', 'ways', 'relations', 'geo-nodes']) {
      await this.client.deleteIndex(index)
    }

    log.debug('Creating indexes')
    for (const index of ['nodes', 'ways', 'relations', 'geo-nodes']) {
      await this.client.createIndex(index)
    }

    const osm = parseOSM()
    const stream = got.stream(config.indexPbfUrl)

    let processedCount = 0

    const geoNodesBatch = new Batch('geo-nodes', this.client)
    const nodesBatch = new Batch('nodes', this.client)
    const waysBatch = new Batch('ways', this.client)
    const relationsBatch = new Batch('relations', this.client)

    const taskIds: number[] = []

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

          const indexItem = {
            id: item.id,
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
          }

          switch (item.type) {
            case 'node':
              item.lat && item.lon
                ? geoNodesBatch.add({
                    ...indexItem,
                    _geo: {
                      lat: item.lat,
                      lng: item.lon,
                    },
                  })
                : nodesBatch.add(indexItem)
              break

            case 'way':
              waysBatch.add(indexItem)
              break

            case 'relation':
              relationsBatch.add(indexItem)
              break
          }

          if (processedCount % 10000 === 0) {
            log.debug({
              count: processedCount,
              geoNodes: geoNodesBatch.getSize(),
              nodes: nodesBatch.getSize(),
              ways: waysBatch.getSize(),
              relations: relationsBatch.getSize(),
            }, 'Processed items')
          }

          for (const batch of [nodesBatch, waysBatch, relationsBatch, geoNodesBatch]) {
            if (batch.getSize() >= config.meilisearch.maxBatchSize - 1024) {
              const task = await batch.send()
              taskIds.push(task.taskUid)
            }
          }
        }

        next()
      })
    )

    stream.once('end', async () => {
      log.debug('Stream ended, sending final batch')

      for (const batch of [nodesBatch, waysBatch, relationsBatch, geoNodesBatch]) {
        await batch.send()
      }

      log.debug('Waiting for indexing to complete')
      await this.client.waitForTasks('nodes', taskIds)
      await this.client.waitForTasks('ways', taskIds)
      await this.client.waitForTasks('relations', taskIds)
      await this.client.waitForTasks('geo-nodes', taskIds)

      log.info('Indexing complete')
    })
  }
}

export const app = new App()
