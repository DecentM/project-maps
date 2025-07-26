import type { StyleSpecification } from 'maplibre-gl'
import { Consts, type StyleConfig } from '.'

export const specification = (config: StyleConfig): StyleSpecification =>
  ({
    version: 8,
    name: 'project-maps',
    projection: {
      type: 'globe',
    },
    sky: {
      'sky-color': Consts.Colours.skyColor,
      'sky-horizon-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.4],
      'horizon-color': Consts.Colours.horizonColor,
      'horizon-fog-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.5],
      'fog-color': Consts.Colours.fogColor,
      'fog-ground-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.2],
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0],
    },
    sprite: config.spritesUrl,
    glyphs: config.fontsUrlPattern,
    layers: [],
    sources: {},
  }) as const
