import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const water: StyleComponent = (config) =>
  ({
    id: 'water',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'water',
    filter: ['all', ['!=', 'brunnel', 'tunnel']],
    paint: { 'fill-color': 'rgb(158,189,255)' },
  }) as unknown as LayerSpecification
