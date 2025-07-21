import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

import type { StyleConfig } from '..'

export const aeroway_runway = (config: StyleConfig) =>
  ({
    id: 'aeroway_runway',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'aeroway',
    minzoom: 11,
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'class', 'runway']],
    paint: {
      'line-color': Consts.Colours.aerowayRunway,
      'line-width': {
        base: 1.2,
        stops: [
          [11, 3],
          [20, 16],
        ],
      },
    },
  }) as unknown as LayerSpecification
