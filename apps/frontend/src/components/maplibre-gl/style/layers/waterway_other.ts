import type { LayerSpecification } from 'maplibre-gl'

export const waterway_other: LayerSpecification = {
  id: 'waterway_other',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'waterway',
  filter: ['all', ['!=', 'class', 'river'], ['!=', 'brunnel', 'tunnel']],
  layout: {
    'line-cap': 'round',
  },
} as LayerSpecification
