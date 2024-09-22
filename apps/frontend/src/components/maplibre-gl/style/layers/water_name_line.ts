import type { LayerSpecification } from 'maplibre-gl'

export const water_name_line: LayerSpecification = {
  id: 'water_name_line',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'waterway',
  filter: ['all', ['==', '$type', 'LineString']],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Regular'],
    'text-max-width': 5,
    'text-size': 12,
    'symbol-placement': 'line',
  },
} as LayerSpecification
