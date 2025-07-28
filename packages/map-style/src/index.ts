import type { StyleSpecification } from 'maplibre-gl'

import { createSources } from './sources'

import { createLayers } from './layers'
import { specification } from './config'

export * as Consts from './consts'

const StyleVariant = {
  Light: 'light',
  Dark: 'dark',
} as const

type StyleVariant = (typeof StyleVariant)[keyof typeof StyleVariant]

export type StyleConfig = {
  variant: StyleVariant
  tileMetadataUrl: string
  tileUrlPattern: string
  spritesUrl: string
  fontsUrlPattern: string
  tintsMetadataUrl: string
  tintsUrlPattern: string
}

export const createStyle = (config: StyleConfig): StyleSpecification => {
  return {
    ...specification(config),
    sources: createSources(config),
    layers: createLayers(config),
  }
}
