import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const landcover_wood: StyleComponent = (config) =>
  ({
    id: 'landcover_wood',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'landcover',
    filter: ['all', ['==', 'class', 'wood']],
    paint: {
      'fill-antialias': false,
      'fill-color': 'hsla(98, 61%, 72%, 0.7)',
      'fill-opacity': 0.4,
    },
  }) as unknown as LayerSpecification
