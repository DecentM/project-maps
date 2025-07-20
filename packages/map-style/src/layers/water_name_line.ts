import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const water_name_line: StyleComponent = (config) =>
  ({
    id: 'water_name_line',
    type: 'symbol',
    source: 'openmaptiles',
    'source-layer': 'waterway',
    filter: ['all', ['==', '$type', 'LineString']],
    layout: {
      'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
      'text-font': ['Roboto-Regular'],
      'text-max-width': 5,
      'text-size': 12,
      'symbol-placement': 'line',
    },
    paint: {
      'text-color': '#5d60be',
      'text-halo-color': 'rgba(255,255,255,0.7)',
      'text-halo-width': 1,
    },
  }) as unknown as LayerSpecification
