import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'

const apiurl = `https://api.geograph.org.uk/syndicator.php?key=${process.env.GEOGRAPH_API_KEY}&format=JSON&limit=10&distance=0.1`

new Elysia()
  .use(cors())
  .get('/api/v1/location-image', async ({ query }) => {
    if (!query.lat || !query.lng) {
      return {
        error: 'Please provide lat and lng query parameters'
      }
    }

    const url = `${apiurl}&q=${query.lat},${query.lng}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    const images = (json?.items ?? []).map((item: any) => {
      return {
        title: item.title,
        author: item.author,
        image: `http://localhost:3000/api/v1/download-image?url=${item.thumb.replaceAll('_120x120', '')}`,
      }
    })

    if (images.length > 10) {
      console.warn(`Geograph returned ${images.length} images, truncating`)
      images.splice(10)
    }

    const totalRx = /\((\d+) in total\)/gui
    const totalString = totalRx.exec(json?.description ?? '')

    return {
      total: Number.parseFloat(totalString?.[1] ?? '0'),
      images,
    }
  })
  .get('/api/v1/download-image', async ({ query, set }) => {
    if (!query.url) {
      return {
        error: 'Please provide url query parameter'
      }
    }

    const result = await fetch(query.url, {
      method: 'GET',
    })

    const blob = await result.blob()

    set.headers['content-type'] = blob.type

    return blob.bytes()
  })
  .listen(3000)
