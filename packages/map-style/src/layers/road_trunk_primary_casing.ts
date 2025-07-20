import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const road_trunk_primary_casing: StyleComponent = (config) =>
  ({
    id: 'road_trunk_primary_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#e9ac77',
      'line-width': {
        base: 1.2,
        stops: [
          [5, 0.4],
          [6, 0.7],
          [7, 1.75],
          [20, 22],
        ],
      },
    },
  }) as unknown as LayerSpecification
