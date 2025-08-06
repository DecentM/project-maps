import { log } from '@project-maps/logging'
import { got, type Method, type RequestFunction } from 'got'
import { CookieJar } from 'tough-cookie'
import VError from 'verror'
import http2wrapper from 'http2-wrapper'

import { config } from 'src/config'

export class WebsiteClient {
  constructor(private baseUrl: string) {}

  private cookieJar = new CookieJar()

  private got = got.extend({
    followRedirect: true,
    request: http2wrapper.auto as RequestFunction,
    timeout: {
      lookup: 250,
      connect: 100,
      secureConnect: 100,
      socket: 1000,
      send: 10_000,
      response: 2000,
    },
    cookieJar: this.cookieJar,
    retry: {
      limit: 3,
      statusCodes: [408, 429, 500, 502, 503, 504],
      calculateDelay({ attemptCount }) {
        return Math.min(attemptCount * 250, 2500)
      },
    },
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'User-Agent': config.userAgent,
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      pragma: 'no-cache',
      priority: 'u=0, i',
      'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
    },
    dnsCache: true,
  })

  private async fetch(method: Method, url: string): Promise<string> {
    log.trace({ url: `${this.baseUrl}${url}` }, 'WebsiteClient.fetch')

    const inProgressResponse = this.got(new URL(url, this.baseUrl), {
      method,
    })

    const timeout = setTimeout(() => {
      log.warn({ url: `${this.baseUrl}${url}` }, 'WebsiteClient.fetch: Request timed out')
      inProgressResponse.cancel('timeout')
    }, 5000)

    const response = await inProgressResponse

    clearTimeout(timeout)

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

  public async getText(url = ''): Promise<string> {
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
