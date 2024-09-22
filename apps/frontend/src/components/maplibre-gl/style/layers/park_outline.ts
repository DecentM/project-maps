import type { LayerSpecification } from 'maplibre-gl'

export const park_outline: LayerSpecification = {
  id: 'park_outline',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'park',
  paint: {
    'line-dasharray': [1, 1.5],
    'line-color': 'rgba(228, 241, 215, 1)',
  },
} as LayerSpecification
