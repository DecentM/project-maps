import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const landuse_hospital: StyleComponent = (config) =>
  ({
    id: 'landuse_hospital',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    filter: ['==', 'class', 'hospital'],
    paint: { 'fill-color': '#fde' },
  }) as unknown as LayerSpecification
