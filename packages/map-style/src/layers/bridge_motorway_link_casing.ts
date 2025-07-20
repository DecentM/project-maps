import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const bridge_motorway_link_casing: StyleComponent = (config) =>
  ({
    id: 'bridge_motorway_link_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'class', 'motorway'], ['==', 'ramp', 1], ['==', 'brunnel', 'bridge']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#e9ac77',
      'line-width': {
        base: 1.2,
        stops: [
          [12, 1],
          [13, 3],
          [14, 4],
          [20, 15],
        ],
      },
    },
  }) as unknown as LayerSpecification
