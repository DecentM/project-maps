import MeiliSearch, { type Index } from 'meilisearch'

import { config } from 'src/config'

export class MeilisearchClient {
  private client = new MeiliSearch({
    host: config.meilisearch.host,
    apiKey: config.meilisearch.apiKey,
  })

  public async findOneIndex(indexName: string): Promise<Index | null> {
    try {
      return await this.client.getIndex(indexName)
    } catch (error) {
      return null
    }
  }

  public async createIndex(indexName: string) {
    return await this.client.createIndex(indexName)
  }

  public async deleteIndex(indexName: string) {
    return await this.client.deleteIndex(indexName)
  }

  public async addDocuments(indexName: string, documents: Array<Record<string, unknown>>) {
    return await this.client.index(indexName).addDocuments(documents)
  }

  public async search(indexName: string, query: string) {
    return await this.client.index(indexName).search(query, {
      attributesToRetrieve: ['id', 'name', '_geo'],
    })
  }

  public async waitForTasks(indexName: string, taskIds: number[]) {
    return await this.client.index(indexName).waitForTasks(taskIds)
  }
}
