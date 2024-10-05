import type { LayerSpecification } from 'maplibre-gl'

export const park: LayerSpecification = {
  id: 'park',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'park',
  paint: {
    'fill-color': '#d8e8c8',
    'fill-opacity': 0.7,
    'fill-outline-color': 'rgba(95, 208, 100, 1)',
  },
} as unknown as LayerSpecification
