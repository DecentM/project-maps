import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

import type { StyleConfig } from '..'

export const boundary_3 = (config: StyleConfig) =>
  ({
    id: 'boundary_3',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'boundary',
    minzoom: 8,
    filter: ['all', ['in', 'admin_level', 3, 4]],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': Consts.Colours.boundary3Outline,
      'line-dasharray': [5, 1],
      'line-width': {
        base: 1,
        stops: [
          [4, 0.4],
          [5, 1],
          [12, 1.8],
        ],
      },
    },
  }) as unknown as LayerSpecification
