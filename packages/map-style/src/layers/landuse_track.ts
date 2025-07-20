import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const landuse_track: StyleComponent = (config) =>
  ({
    id: 'landuse_track',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landuse',
    filter: ['==', 'class', 'track'],
    paint: { 'fill-color': '#DEE3CD' },
  }) as unknown as LayerSpecification
