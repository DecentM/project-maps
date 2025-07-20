import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const building_3d: StyleComponent = (config) =>
  ({
    id: 'building-3d',
    type: 'fill-extrusion',
    source: 'openmaptiles',
    'source-layer': 'building',
    minzoom: 15,
    paint: {
      'fill-extrusion-color': 'hsl(35, 8%, 85%)',
      'fill-extrusion-height': { property: 'render_height', type: 'identity' },
      'fill-extrusion-base': { property: 'render_min_height', type: 'identity' },
      'fill-extrusion-opacity': 0.8,
    },
  }) as unknown as LayerSpecification
