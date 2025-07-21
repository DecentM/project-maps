import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const landuse_residential = (config: StyleConfig) =>
  ({
    id: 'landuse_residential',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    maxzoom: 8,
    filter: ['==', 'class', 'residential'],
    paint: {
      'fill-color': {
        base: 1,
        stops: [
          [9, 'hsla(0, 3%, 85%, 0.84)'],
          [12, 'hsla(35, 57%, 88%, 0.49)'],
        ],
      },
    },
  }) as unknown as LayerSpecification
