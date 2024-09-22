import type { LayerSpecification } from 'maplibre-gl'

export const landuse_track: LayerSpecification = {
  id: 'landuse_track',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'track'],
  paint: {
    'fill-color': '#DEE3CD',
  },
} as LayerSpecification
