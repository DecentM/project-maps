import { log } from '@project-maps/logging'
import { JSDOM } from 'jsdom'
import { DateTime } from 'luxon'
import { NewsClient, type Article } from 'src/lib/news-client'

export class TheIndependentClient extends NewsClient {
  private handleHeroPlus3Articles($section: Element): string[] {
    const result: string[] = []
    const $heroArticle = $section.querySelector('.hero-article')
    const linkElement = $heroArticle?.querySelector('a')

    if (linkElement) {
      const href = linkElement.getAttribute('href')
      if (href) {
        result.push(new URL(href, 'https://www.independent.co.uk').toString())
      }
    }
    return result
  }

  private handleGeneric($section: Element): string[] {
    const $links = [...$section.querySelectorAll('a')].filter(($a) => $a.href.endsWith('.html'))

    return $links.map(($a) =>
      new URL($a.getAttribute('href') || '', 'https://www.independent.co.uk').toString()
    )
  }

  private async extractArticleData(url: string): Promise<Article | undefined> {
    try {
      const parsedUrl = new URL(url)
      const body = await this.get(url)
      const dom = new JSDOM(body)

      const $article = dom.window.document.querySelector('#articleContent')
      const $header = $article?.querySelector('#articleHeader')
      if (!$article || !$header) return undefined

      const $headline = $header.querySelector('h1')
      const $description = $header.querySelector('h2')
      const $publishedAt = $header.querySelector('#article-published-date')
      const $thumbnail = [...$article.querySelectorAll('img')].find(
        ($img) => $img.src && $img.srcset
      )

      return {
        id: parsedUrl.pathname,
        title: $headline?.textContent?.trim() || '',
        description: $description?.textContent?.trim() || '',
        publishedAt: $publishedAt?.textContent
          ? DateTime.fromFormat($publishedAt.textContent.trim(), 'cccc dd MMMM yyyy T z', {
              locale: 'en-GB',
            }).toJSDate()
          : undefined,
        url,
        thumbnailUrl: $thumbnail?.getAttribute('src') || undefined,
        thumbnailSrcSet: $thumbnail?.getAttribute('srcset') || undefined,
      }
    } catch (error) {
      if (error instanceof Error) {
        log.error(
          { name: error.name, message: error.message, url },
          'TheIndependentClient.extractArticleData'
        )
      }
      return undefined
    }
  }

  public async getRecentArticles(topicId: string) {
    const url = `https://www.independent.co.uk/topic/${topicId}?CMP=ILC-refresh`
    const articles: Article[] = []

    try {
      const body = await this.get(url)
      const dom = new JSDOM(body)

      const sectionContent = dom.window.document.querySelector('#sectionContent')
      if (!sectionContent) return void 0

      const urlsToVisit: string[] = []

      const $title = dom.window.document.querySelector('[data-type="Title"]')
      const $allDataTypeSections = sectionContent.querySelectorAll('[data-type]')

      for (const $section of $allDataTypeSections) {
        // dataset doesn't exist in JSDOM
        // eslint-disable-next-line unicorn/prefer-dom-node-dataset
        const dataType = $section.getAttribute('data-type')

        switch (dataType) {
          case 'HeroPlus3Articles':
            for (const url of this.handleHeroPlus3Articles($section)) {
              if (!urlsToVisit.includes(url)) urlsToVisit.push(url)
            }
            break
          default:
            for (const url of this.handleGeneric($section)) {
              if (!urlsToVisit.includes(url)) urlsToVisit.push(url)
            }
            break
        }
      }

      for (const url of urlsToVisit.slice(0, 5)) {
        const article = await this.extractArticleData(url)
        if (!article) continue

        articles.push(article)
      }

      return {
        id: topicId,
        name: $title?.textContent?.trim() || '',
        url,
        articles,
      }
    } catch (error) {
      if (error instanceof Error) {
        log.error(
          { name: error.name, message: error.message, topicId },
          'TheIndependentClient.getRecentArticles'
        )
      }
      return void 0
    }
  }
}
