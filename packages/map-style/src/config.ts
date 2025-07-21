import type { StyleSpecification } from 'maplibre-gl'
import type { StyleConfig } from '.'

export const specification = (config: StyleConfig): StyleSpecification =>
  ({
    version: 8,
    name: 'project-maps',
    projection: {
      type: 'globe',
    },
    sky: {
      'sky-color': '#3D71AD',
      'sky-horizon-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.4],
      'horizon-color': '#9CB6D4',
      'horizon-fog-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.5],
      'fog-color': '#CEE8FD',
      'fog-ground-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.2],
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0],
    },
    sprite: `${config.spritesUrlBase}/mdi`,
    glyphs: `${config.fontsUrlBase}/{fontstack}/{range}.pbf`,
    layers: [],
    sources: {},
  }) as const
