import type { LayerSpecification } from 'maplibre-gl'

export const poi_transit: LayerSpecification = {
  id: 'poi_transit',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'poi',
  filter: ['all', ['in', 'class', 'bus', 'rail', 'airport']],
  layout: {
    'icon-image': '{class}',
    'text-anchor': 'left',
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
    'text-max-width': 9,
    'text-offset': [0.9, 0],
    'text-size': 12,
  },
  paint: {
    'text-color': '#4898ff',
    'text-halo-blur': 0.5,
    'text-halo-color': '#ffffff',
    'text-halo-width': 1,
  },
} as unknown as LayerSpecification
