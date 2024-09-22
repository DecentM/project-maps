import type { LayerSpecification } from 'maplibre-gl'

export const water_name_point: LayerSpecification = {
  id: 'water_name_point',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'water_name',
  filter: ['==', '$type', 'Point'],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Regular'],
    'text-max-width': 5,
    'text-size': 12,
  },
  paint: {
    'text-color': '#5d60be',
    'text-halo-color': 'rgba(255,255,255,0.7)',
    'text-halo-width': 1,
  },
} as unknown as LayerSpecification
