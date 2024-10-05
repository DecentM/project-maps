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
    'text-anchor': 'bottom',
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Medium'],
    'text-max-width': 8,
    'text-offset': [0, 0],
    'text-size': {
      base: 1.2,
      stops: [
        [7, 14],
        [11, 24],
      ],
    },
    'icon-allow-overlap': true,
    'icon-optional': false,
  },
  paint: {
    'text-color': '#333',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 1.2,
  },
} as unknown as LayerSpecification
