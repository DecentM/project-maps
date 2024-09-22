import type { LayerSpecification } from 'maplibre-gl'

export const bridge_motorway: LayerSpecification = {
  id: 'bridge_motorway',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'class', 'motorway'], ['!=', 'ramp', 1], ['==', 'brunnel', 'bridge']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification