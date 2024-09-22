import type { LayerSpecification } from 'maplibre-gl'

export const place_town: LayerSpecification = {
  id: 'place_town',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  filter: ['all', ['==', 'class', 'town']],
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
