import type { LayerSpecification } from 'maplibre-gl'

export const waterway_river: LayerSpecification = {
  id: 'waterway_river',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'waterway',
  filter: ['all', ['==', 'class', 'river'], ['!=', 'brunnel', 'tunnel']],
  layout: {
    'line-cap': 'round',
  },
} as LayerSpecification
