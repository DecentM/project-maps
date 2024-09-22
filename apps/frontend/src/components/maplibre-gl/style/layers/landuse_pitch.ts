import type { LayerSpecification } from 'maplibre-gl'

export const landuse_pitch: LayerSpecification = {
  id: 'landuse_pitch',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'pitch'],
  paint: {
    'fill-color': '#DEE3CD',
  },
} as LayerSpecification
