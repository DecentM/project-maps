import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const road_one_way_arrow = (config: StyleConfig) =>
  ({
    id: 'road_one_way_arrow',
    type: 'symbol',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    minzoom: 16,
    filter: ['==', 'oneway', 1],
    layout: { 'icon-image': 'arrow', 'symbol-placement': 'line' },
  }) as unknown as LayerSpecification
