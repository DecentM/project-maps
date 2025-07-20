import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const landuse_pitch: StyleComponent = (config) =>
  ({
    id: 'landuse_pitch',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    filter: ['==', 'class', 'pitch'],
    paint: { 'fill-color': '#DEE3CD' },
  }) as unknown as LayerSpecification
