import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const building = (config: StyleConfig) =>
  ({
    id: 'building',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'building',
    minzoom: 13,
    maxzoom: 14,
    paint: {
      'fill-color': 'hsl(35, 8%, 85%)',
      'fill-outline-color': {
        base: 1,
        stops: [
          [13, 'hsla(35, 6%, 79%, 0.32)'],
          [14, 'hsl(35, 6%, 79%)'],
        ],
      },
    },
  }) as unknown as LayerSpecification
