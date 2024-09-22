import type { LayerSpecification } from 'maplibre-gl'

export const bridge_secondary_tertiary_casing: LayerSpecification = {
  id: 'bridge_secondary_tertiary_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'secondary', 'tertiary']],
  layout: { 'line-join': 'round' },
  paint: {
    'line-color': '#e9ac77',
    'line-width': {
      base: 1.2,
      stops: [
        [8, 1.5],
        [20, 17],
      ],
    },
  },
} as unknown as LayerSpecification
