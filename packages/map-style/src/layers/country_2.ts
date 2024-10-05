import type { LayerSpecification } from 'maplibre-gl'

export const country_2: LayerSpecification = {
  id: 'country_2',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  filter: ['all', ['==', 'rank', 2], ['==', 'class', 'country']],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['RobotoCondensed-Italic'],
    'text-max-width': 6.25,
    'text-size': {
      stops: [
        [2, 11],
        [5, 17],
      ],
    },
    'text-transform': 'none',
  },
  paint: {
    'text-color': '#334',
    'text-halo-blur': 1,
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 1,
  },
} as unknown as LayerSpecification
