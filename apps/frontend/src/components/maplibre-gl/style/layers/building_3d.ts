import type { LayerSpecification } from 'maplibre-gl'

export const building_3d: LayerSpecification = {
  id: 'building-3d',
  type: 'fill-extrusion',
  source: 'openmaptiles',
  'source-layer': 'building',
  minzoom: 14,
  paint: {
    'fill-extrusion-color': 'hsl(35, 8%, 85%)',
    'fill-extrusion-height': {
      property: 'render_height',
      type: 'identity',
    },
  },
} as LayerSpecification
