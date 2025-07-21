import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

import type { StyleConfig } from '..'

export const bridge_link_casing = (config: StyleConfig) =>
  ({
    id: 'bridge_link_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'class', 'link'], ['==', 'brunnel', 'bridge']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': Consts.Colours.bridgeLinkCasing,
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
