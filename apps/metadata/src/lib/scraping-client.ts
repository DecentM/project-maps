import { log } from '@project-maps/logging'
import { type Method } from 'got'
import VError from 'verror'

import { http } from 'src/lib/http'

export abstract class ScrapingClient {
  private got = http()

  private async fetch(method: Method, url: string): Promise<string> {
    log.trace({ url }, `${this.constructor.name}.fetch`)

    const response = await this.got(new URL(url), {
      method,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    return response.body
  }

  protected get(url: string): Promise<string> {
    try {
      return this.fetch('GET', url)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, `${this.constructor.name}.get`)
      }
      throw new Error(`${this.constructor.name}.get`)
    }
  }
}
