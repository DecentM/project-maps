import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const landuse_cemetery = (config: StyleConfig) =>
  ({
    id: 'landuse_cemetery',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    filter: ['==', 'class', 'cemetery'],
    paint: { 'fill-color': 'hsl(75, 37%, 81%)' },
  }) as unknown as LayerSpecification
