import type { LayerSpecification } from 'maplibre-gl'

export const road_one_way_arrow_opposite: LayerSpecification = {
  id: 'road_one_way_arrow_opposite',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  minzoom: 16,
  filter: ['==', 'oneway', -1],
  layout: { 'icon-image': 'arrow', 'symbol-placement': 'line', 'icon-rotate': 180 },
} as unknown as LayerSpecification
