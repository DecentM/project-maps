import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const place_town: StyleComponent = (config) =>
  ({
    id: 'place_town',
    type: 'symbol',
    source: 'openmaptiles',
    'source-layer': 'place',
    filter: ['all', ['==', 'class', 'town']],
    layout: {
      'icon-image': {
        base: 1,
        stops: [
          [0, 'dot_9'],
          [8, ''],
        ],
      },
      'text-anchor': 'bottom',
      'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
      'text-font': ['Roboto-Regular'],
      'text-max-width': 8,
      'text-offset': [0, 0],
      'text-size': {
        base: 1.2,
        stops: [
          [7, 12],
          [11, 16],
        ],
      },
    },
    paint: {
      'text-color': '#333',
      'text-halo-color': 'rgba(255,255,255,0.8)',
      'text-halo-width': 1.2,
    },
  }) as unknown as LayerSpecification
