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
    const task = await this.client.index(indexName).addDocuments(documents)

    return await this.client.waitForTask(task.taskUid, { timeOutMs: 10 * 60 * 1000 })
  }

  public async search(indexName: string, query: string) {
    return await this.client.index(indexName).search(query)
  }
}
