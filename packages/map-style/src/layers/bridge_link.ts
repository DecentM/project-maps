import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

import type { StyleConfig } from '..'

export const bridge_link = (config: StyleConfig) =>
  ({
    id: 'bridge_link',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'class', 'link'], ['==', 'brunnel', 'bridge']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': Consts.Colours.bridgeLink,
      'line-width': {
        base: 1.2,
        stops: [
          [12.5, 0],
          [13, 1.5],
          [14, 2.5],
          [20, 11.5],
        ],
      },
    },
  }) as unknown as LayerSpecification
