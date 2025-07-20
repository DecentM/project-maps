import type { LayerSpecification, LngLat, StyleSpecification } from 'maplibre-gl'

import { createSources } from './sources'

import { createLayers } from './layers'
import { terrain } from './terrain'
import { specification } from './config'

export * as Consts from './consts'

export { classToIcon } from './icon-mapping'

const StyleVariant = {
  Light: 'light',
  Dark: 'dark',
} as const

type StyleVariant = (typeof StyleVariant)[keyof typeof StyleVariant]

export type StyleConfig = {
  center: LngLat
  zoom: number
  variant: StyleVariant
}

export type StyleComponent = (config: StyleConfig) => LayerSpecification

export const createStyle = (config: StyleConfig): StyleSpecification => {
  return {
    ...specification,
    zoom: config.zoom,
    center: [config.center.lng, config.center.lat],
    sources: createSources(config),
    layers: createLayers(config),
    terrain,
  }
}
