import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const landcover_ice: StyleComponent = (config) =>
  ({
    id: 'landcover_ice',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landcover',
    filter: ['all', ['==', 'class', 'ice']],
    paint: { 'fill-antialias': false, 'fill-color': 'rgba(224, 236, 236, 1)', 'fill-opacity': 0.8 },
  }) as unknown as LayerSpecification
