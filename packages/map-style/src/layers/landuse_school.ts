import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const landuse_school = (config: StyleConfig) =>
  ({
    id: 'landuse_school',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    filter: ['==', 'class', 'school'],
    paint: { 'fill-color': 'rgb(236,238,204)' },
  }) as unknown as LayerSpecification
