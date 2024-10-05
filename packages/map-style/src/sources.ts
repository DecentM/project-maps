import type { SourceSpecification } from 'maplibre-gl'
import * as Consts from './consts'

export const sources: Record<string, SourceSpecification> = {
  openmaptiles: {
    type: 'vector',
    url: Consts.Urls.openmaptilesSource,
  },
  terrain: {
    type: 'raster-dem',
    url: Consts.Urls.terrainSource,
    tiles: [`${Consts.Urls.terrainSource.replace('/metadata.json', '')}/{z}/{x}/{y}.png`],
  },
  tints: {
    maxzoom: 6,
    tileSize: 256,
    url: Consts.Urls.tintsSource,
    tiles: [`${Consts.Urls.tintsSource.replace('/metadata.json', '')}/{z}/{x}/{y}.png`],
    type: 'raster',
  },
}
