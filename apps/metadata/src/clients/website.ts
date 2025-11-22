import { log } from '@project-maps/logging'
import { type Method } from 'got'
import VError from 'verror'
import { http } from 'src/lib/http'

export type Website = {
  getText: (url: string) => Promise<string>
}

export class WebsiteClient implements Website {
  constructor() {}

  private got = http()

  private async fetch(method: Method, url: string): Promise<string> {
    log.trace({ url }, 'WebsiteClient.fetch')

    const response = await this.got(new URL(url), {
      method,
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      },
    })

    return response.body
  }

  private get(url: string): Promise<string> {
    try {
      return this.fetch('GET', url)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WebsiteClient.get')
      }
      throw new Error('WebsiteClient.get')
    }
  }

  public async getText(url: string): Promise<string> {
    try {
      return await this.get(url)
    } catch (error) {
      if (error instanceof Error) {
        log.error({ name: error.name, message: error.message }, 'WebsiteClient.getText')
      }
      return ''
    }
  }
}
