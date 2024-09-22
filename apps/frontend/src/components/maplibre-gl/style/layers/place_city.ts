import type { LayerSpecification } from 'maplibre-gl'

export const place_city: LayerSpecification = {
  id: 'place_city',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  minzoom: 5,
  filter: ['all', ['==', 'class', 'city']],
  layout: {
    'icon-image': {
      base: 1,
      stops: [
        [0, 'dot_9'],
        [8, ''],
      ],
    },
  },
} as unknown as LayerSpecification
