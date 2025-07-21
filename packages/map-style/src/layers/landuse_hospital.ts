import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const landuse_hospital = (config: StyleConfig) =>
  ({
    id: 'landuse_hospital',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    filter: ['==', 'class', 'hospital'],
    paint: { 'fill-color': '#fde' },
  }) as unknown as LayerSpecification
