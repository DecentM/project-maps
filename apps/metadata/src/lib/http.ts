import got, { type RequestFunction } from 'got'
import http2wrapper from 'http2-wrapper'
import { CookieJar } from 'tough-cookie'

import { config } from 'src/config'
import { log } from '@project-maps/logging'

export const http = () => {
  const cookieJar = new CookieJar()

  return got.extend({
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
    cookieJar,
    retry: {
      limit: 3,
      statusCodes: [408, 429, 500, 502, 503, 504],
      calculateDelay({ attemptCount }) {
        return Math.min(attemptCount * 250, 2500)
      },
    },
    headers: {
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
    hooks: {
      beforeRequest: [
        (options) => log.trace({ url: options.url, method: options.method }, 'HTTP request'),
      ],

      beforeRedirect: [
        (options, response) =>
          log.trace({ from: options.url, to: response.headers['location'] }, 'HTTP redirect'),
      ],

      beforeRetry: [
        (error, retryCount) =>
          log.trace({ message: error.message, code: error.code, retryCount }, 'HTTP retry'),
      ],

      afterResponse: [
        (response) => {
          log.trace({ url: response.url, statusCode: response.statusCode }, 'HTTP response')
          return response
        },
      ],
    },
  })
}
