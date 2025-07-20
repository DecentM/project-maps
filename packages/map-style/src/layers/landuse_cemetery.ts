import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const landuse_cemetery: StyleComponent = (config) =>
  ({
    id: 'landuse_cemetery',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    filter: ['==', 'class', 'cemetery'],
    paint: { 'fill-color': 'hsl(75, 37%, 81%)' },
  }) as unknown as LayerSpecification
