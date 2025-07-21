import type { StyleSpecification } from 'maplibre-gl'
import type { StyleConfig } from '.'

export const specification = (config: StyleConfig): StyleSpecification =>
  ({
    version: 8,
    name: 'project-maps',
    sprite: `${config.spritesUrlBase}/mdi`,
    glyphs: `${config.fontsUrlBase}/{fontstack}/{range}.pbf`,
    layers: [],
    sources: {},
  }) as const
