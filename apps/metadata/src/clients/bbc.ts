import { log } from '@project-maps/logging'
import { JSDOM } from 'jsdom'
import { DateTime } from 'luxon'
import { NewsClient, type Article } from 'src/lib/news-client'

export class BBCClient extends NewsClient {
  public async getRecentArticles(topicId: string) {
    const url = `https://www.bbc.com/news/topics/${topicId}`
    const articles: Article[] = []

    try {
      const body = await this.get(url)
      const dom = new JSDOM(body)
      const articleElements = [
        ...dom.window.document.querySelectorAll(
          '[data-testid="alaska-grid"] > [data-testid="liverpool-card"]'
        ),
      ]
      const titleElement = dom.window.document.querySelector('h1')

      for (const articleElement of articleElements.slice(0, 5)) {
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
          description: descriptionElement?.textContent?.trim() || '',
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
        dom.window.close()
      }

      return {
        id: topicId,
        name: titleElement?.textContent?.trim() || '',
        url,
        articles,
      }
    } catch (error) {
      if (error instanceof Error) {
        log.error(
          { name: error.name, message: error.message, topicId },
          'BBCClient.getRecentArticles'
        )
      }
      return void 0
    }
  }
}
