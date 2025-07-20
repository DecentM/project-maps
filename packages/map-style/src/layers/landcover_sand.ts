import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const landcover_sand: StyleComponent = (config) =>
  ({
    id: 'landcover_sand',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landcover',
    filter: ['all', ['==', 'class', 'sand']],
    paint: { 'fill-color': 'rgba(247, 239, 195, 1)' },
  }) as unknown as LayerSpecification
