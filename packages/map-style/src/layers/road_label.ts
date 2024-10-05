import type { LayerSpecification } from 'maplibre-gl'

export const road_label: LayerSpecification = {
  id: 'road_label',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'transportation_name',
  filter: ['all'],
  layout: {
    'symbol-placement': 'line',
    'text-anchor': 'center',
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto-Regular'],
    'text-offset': [0, 0.15],
    'text-size': {
      base: 1,
      stops: [
        [13, 12],
        [14, 13],
      ],
    },
  },
  paint: { 'text-color': '#765', 'text-halo-blur': 0.5, 'text-halo-width': 1 },
} as unknown as LayerSpecification
