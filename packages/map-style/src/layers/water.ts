import type { LayerSpecification } from 'maplibre-gl'

import { Consts, type StyleConfig } from '..'

export const water = (config: StyleConfig) =>
  ({
    id: 'water',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'water',
    layout: {
      visibility: 'visible',
    },
    filter: ['all', ['!=', 'brunnel', 'tunnel']],
    paint: { 'fill-color': Consts.Colours.water },
  }) as unknown as LayerSpecification
