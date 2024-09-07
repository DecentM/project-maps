import got from 'got'

export class OverpassClient {
  public constructor(
    private baseUrl: string
  ) { }

  private fetch = (path: string, query: Record<string, string | number>) => {
    return got.get(`${this.baseUrl}${path}`, {
      headers: {
        Accept: 'application/json',
      },
      searchParams: query,
    })
  }
}
