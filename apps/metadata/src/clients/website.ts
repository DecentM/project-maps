import { log } from '@project-maps/logging'
import { got, type Method, type RequestFunction, type Response } from 'got'
import { CookieJar } from 'tough-cookie'
import VError from 'verror'
import http2wrapper from 'http2-wrapper'

import { config } from 'src/config'

export class WebsiteClient {
  constructor(private baseUrl: string) {}

  private cookieJar = new CookieJar()

  private requestCache = new Map()

  private got = got.extend({
    request: http2wrapper.auto as RequestFunction,
    timeout: {
      lookup: 250,
      connect: 100,
      secureConnect: 100,
      socket: 1000,
      send: 10_000,
      response: 2000,
    },
    cache: this.requestCache,
    followRedirect: true,
    cookieJar: this.cookieJar,
    retry: {
      limit: 3,
      statusCodes: [408, 429, 500, 502, 503, 504],
      calculateDelay({ attemptCount }) {
        return Math.min(attemptCount * 250, 2500)
      },
    },
    headers: {
      Accept: 'application/json',
      'User-Agent': config.userAgent,
    },
    dnsCache: true,
    responseType: 'text',
  })

  private async fetch(method: Method, url: string): Promise<Response<string>> {
    log.trace({ url }, 'WebsiteClient.fetch')

    return await this.got(new URL(url, this.baseUrl), {
      method,
    })
  }

  private get(url: string): Promise<Response<string>> {
    try {
      return this.fetch('GET', url)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WebsiteClient.get')
      }
      throw new Error('WebsiteClient.get')
    }
  }

  public async getText(url = ''): Promise<string> {
    try {
      const response = await this.get(url)

      return response.body
    } catch (error) {
      if (error instanceof Error) {
        log.error(error, 'WebsiteClient.getText')
      }
      return ''
    }
  }
}
