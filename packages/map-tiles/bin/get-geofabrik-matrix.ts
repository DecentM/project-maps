#!/bin/false

import { JSDOM } from 'jsdom'
import got from 'got'
import { program } from 'commander'

const cmd = program
  .name('get-geofabrik-matrix')
  .description('Fetches the Geofabrik matrix and outputs it as JSON')
  .argument('<url>', 'URL of the Geofabrik index')
  .parse()

const print = (message: string | object) =>
  process.stdout.write(`${typeof message === 'string' ? message : JSON.stringify(message)}\n`)

const [url] = cmd.args

const response = await got.get(url, { responseType: 'text' })

if (response.statusCode !== 200) {
  throw new Error(`Failed to fetch URL: ${url} (status code: ${response.statusCode})`)
}

const dom = new JSDOM(response.body)
const subregionTables$ = dom.window.document.querySelectorAll('#subregions')

if (!subregionTables$ || subregionTables$.length === 0) {
  print([])
  process.exit(0)
}

const subregions$: Array<Element> = []

for (const table$ of subregionTables$) {
  if (!table$.querySelector('a[href$=".html"]')) {
    continue
  }

  for (const row$ of table$.querySelectorAll('tr')) {
    subregions$.push(row$)
  }
}

if (!subregions$ || subregions$.length === 0) {
  print([])
  process.exit(0)
}

type Result = {
  name: string
  url: string
}

const result: Result[] = []

for (const subregion of subregions$) {
  if (!subregion.querySelector('a')) {
    continue
  }

  const link$ = subregion.querySelector('a')
  const regionName = link$?.getAttribute('href')?.split('/')?.pop()?.replace('.html', '')

  const shape$ = subregion.querySelector('a[href*=".shp."]')
  const size$ = subregion.querySelector('td:nth-child(3)')

  const [sizeValue, sizeUnit] =
    size$?.textContent
      ?.substring(1, size$.textContent.length - 1)
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ') ?? []

  let sizeAcceptable = false

  if (sizeValue && sizeUnit) {
    const sizeNumber = Number.parseFloat(sizeValue)

    if (sizeUnit === 'GB' || sizeUnit === 'GiB') {
      sizeAcceptable = !Number.isNaN(sizeNumber) && sizeNumber < 2 && sizeNumber > 0
    }

    if (sizeUnit === 'MB' || sizeUnit === 'MiB') {
      sizeAcceptable = true
    }
  }

  const isLeaf = shape$ !== null || sizeAcceptable

  const url$ = subregion.querySelector(isLeaf ? 'a[href$=".osm.pbf"]' : 'a[href$=".html"]')
  const href = url$?.getAttribute('href')

  if (!regionName || !href) {
    continue
  }

  result.push({
    name: regionName,
    url: new URL(href, url).toString(),
  })
}

print(result)
