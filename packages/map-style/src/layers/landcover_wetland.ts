import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const landcover_wetland = (config: StyleConfig) =>
  ({
    id: 'landcover_wetland',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landcover',
    minzoom: 12,
    filter: ['all', ['==', 'class', 'wetland']],
    paint: {
      'fill-antialias': true,
      'fill-opacity': 0.8,
      'fill-pattern': 'wetland_bg_11',
      'fill-translate-anchor': 'map',
    },
  }) as unknown as LayerSpecification
