import { ScrapingClient } from 'src/lib/scraping-client'

export type Article = {
  id: string
  title: string
  url: string
  description?: string
  publishedAt?: Date
  thumbnailUrl?: string
  thumbnailSrcSet?: string
}

export type Topic = {
  id: string
  name: string
  url: string
  articles: Article[]
}

export type News = {
  getRecentArticles: (topicId: string) => Promise<Topic | undefined>
}

export abstract class NewsClient extends ScrapingClient implements News {
  public abstract getRecentArticles(topicId: string): Promise<Topic | undefined>
}
