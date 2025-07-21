import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const landcover_ice = (config: StyleConfig) =>
  ({
    id: 'landcover_ice',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landcover',
    filter: ['all', ['==', 'class', 'ice']],
    paint: { 'fill-antialias': false, 'fill-color': 'rgba(224, 236, 236, 1)', 'fill-opacity': 0.8 },
  }) as unknown as LayerSpecification
