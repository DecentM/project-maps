import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const park_outline = (config: StyleConfig) =>
  ({
    id: 'park_outline',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'park',
    paint: { 'line-dasharray': [1, 1.5], 'line-color': 'rgba(228, 241, 215, 1)' },
  }) as unknown as LayerSpecification
