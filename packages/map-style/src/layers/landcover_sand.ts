import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const landcover_sand = (config: StyleConfig) =>
  ({
    id: 'landcover_sand',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landcover',
    filter: ['all', ['==', 'class', 'sand']],
    paint: { 'fill-color': 'rgba(247, 239, 195, 1)' },
  }) as unknown as LayerSpecification
