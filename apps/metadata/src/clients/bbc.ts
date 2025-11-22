import { log } from '@project-maps/logging'
import { type Method } from 'got'
import VError from 'verror'
import { JSDOM } from 'jsdom'
import { DateTime } from 'luxon'

import { http } from 'src/lib/http'

type Article = {
  id: string
  title: string
  blurb: string
  publishedAt?: Date
  url: string
  thumbnailUrl?: string
  thumbnailSrcSet?: string
}

type Topic = {
  id: string
  name: string
  url: string
  articles: Article[]
}

export type BBC = {
  getRecentArticles: (topicId: string) => Promise<Topic | undefined>
}

export class BBCClient implements BBC {
  constructor() {}

  private got = http()

  private async fetch(method: Method, url: string): Promise<string> {
    log.trace({ url }, 'BBCClient.fetch')

    const response = await this.got(new URL(url), {
      method,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    return response.body
  }

  private get(url: string): Promise<string> {
    try {
      return this.fetch('GET', url)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'BBCClient.get')
      }
      throw new Error('BBCClient.get')
    }
  }

  public async getRecentArticles(topicId: string): Promise<Topic | undefined> {
    const url = `https://www.bbc.com/news/topics/${topicId}`
    const articles: Article[] = []

    try {
      const body = await this.get(url)
      const dom = new JSDOM(body)
      const articleElements = dom.window.document.querySelectorAll(
        '[data-testid="alaska-grid"] > [data-testid="liverpool-card"]'
      )
      const titleElement = dom.window.document.querySelector('h1')

      for (const articleElement of articleElements) {
        const updatedAtElement = articleElement.querySelector(
          '[data-testid="card-metadata-lastupdated"]'
        )
        const headlineElement = articleElement.querySelector('[data-testid="card-headline"]')
        const descriptionElement = articleElement.querySelector('[data-testid="card-description"]')
        const linkElement = articleElement.querySelector('a')
        const imageElement = articleElement.querySelector('img[srcset]')

        const article: Article = {
          id: linkElement?.getAttribute('href') || '',
          title: headlineElement?.textContent?.trim() || '',
          blurb: descriptionElement?.textContent?.trim() || '',
          publishedAt: updatedAtElement?.textContent
            ? DateTime.fromFormat(updatedAtElement.textContent.trim(), 'd MMM yyyy', {
                locale: 'en',
              }).toJSDate()
            : undefined,
          url: linkElement
            ? new URL(linkElement.getAttribute('href') || '', 'https://www.bbc.com').toString()
            : '',
          thumbnailUrl: imageElement?.getAttribute('src') || undefined,
          thumbnailSrcSet: imageElement?.getAttribute('srcset') || undefined,
        }

        articles.push(article)
      }

      return {
        id: topicId,
        name: titleElement?.textContent?.trim() || '',
        url,
        articles,
      }
    } catch (error) {
      if (error instanceof Error) {
        log.error({ name: error.name, message: error.message }, 'BBCClient.getRecentArticles')
      }
      return undefined
    }
  }
}
