import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const state = (config: StyleConfig) =>
  ({
    id: 'state',
    type: 'symbol',
    source: 'openmaptiles',
    'source-layer': 'place',
    maxzoom: 6,
    filter: ['all', ['==', 'class', 'state']],
    layout: {
      'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
      'text-font': ['RobotoCondensed-Italic'],
      'text-size': {
        stops: [
          [4, 11],
          [6, 15],
        ],
      },
      'text-transform': 'uppercase',
    },
    paint: {
      'text-color': '#633',
      'text-halo-color': 'rgba(255,255,255,0.7)',
      'text-halo-width': 1,
    },
  }) as unknown as LayerSpecification
