import type { LngLat, StyleSpecification } from 'maplibre-gl'

import { createSources } from './sources'

import { layers } from './layers'
import { terrain } from './terrain'
import { specification } from './config'

export * as Consts from './consts'

export { classToIcon } from './icon-mapping'

export type StyleConfig = {
  center: LngLat
  zoom: number
}

export const createStyle = (config: StyleConfig): StyleSpecification => {
  return {
    ...specification,
    zoom: config.zoom,
    center: [config.center.lng, config.center.lat],
    sources: createSources(config),
    layers,
    terrain,
  }
}
