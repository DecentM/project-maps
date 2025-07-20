import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const road_one_way_arrow: StyleComponent = (config) =>
  ({
    id: 'road_one_way_arrow',
    type: 'symbol',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    minzoom: 16,
    filter: ['==', 'oneway', 1],
    layout: { 'icon-image': 'arrow', 'symbol-placement': 'line' },
  }) as unknown as LayerSpecification
