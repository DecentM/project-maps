import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const country_3 = (config: StyleConfig) =>
  ({
    id: 'country_3',
    type: 'symbol',
    source: 'openmaptiles',
    'source-layer': 'place',
    filter: ['all', ['>=', 'rank', 3], ['==', 'class', 'country']],
    layout: {
      'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
      'text-font': ['RobotoCondensed-Italic'],
      'text-max-width': 6.25,
      'text-size': {
        stops: [
          [3, 11],
          [7, 17],
        ],
      },
      'text-transform': 'none',
    },
    paint: {
      'text-color': '#334',
      'text-halo-blur': 1,
      'text-halo-color': 'rgba(255,255,255,0.8)',
      'text-halo-width': 1,
    },
  }) as unknown as LayerSpecification
