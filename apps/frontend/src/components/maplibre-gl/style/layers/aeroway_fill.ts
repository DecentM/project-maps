import type { LayerSpecification } from 'maplibre-gl'

export const aeroway_fill: LayerSpecification = {
  id: 'aeroway_fill',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'aeroway',
  minzoom: 11,
  filter: ['==', '$type', 'Polygon'],
  paint: {
    'fill-color': 'rgba(229, 228, 224, 1)',
    'fill-opacity': 0.7,
  },
} as LayerSpecification
