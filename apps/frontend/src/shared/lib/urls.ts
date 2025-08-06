export const prettifyUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url)

    return `${parsedUrl.hostname.replaceAll(/^www\./gu, '')}${parsedUrl.pathname === '/' ? '' : parsedUrl.pathname}`
  } catch {
    return url
  }
}

export const splitUrl = (url: string): [string, string] | [string] => {
  try {
    const parsedUrl = new URL(url)

    return [parsedUrl.hostname.replaceAll(/^www\./gu, ''), parsedUrl.pathname]
  } catch {
    return [url]
  }
}

export const sameUrls = (url1?: string, url2?: string) => {
  if (!url1 || !url2) return false

  try {
    const parsedUrl1 = new URL(url1)
    const parsedUrl2 = new URL(url2)

    return (
      parsedUrl1.hostname.replaceAll(/^www\./gu, '') ===
        parsedUrl2.hostname.replaceAll(/^www\./gu, '') &&
      parsedUrl1.pathname === parsedUrl2.pathname
    )
  } catch {
    return url1 === url2
  }
}
