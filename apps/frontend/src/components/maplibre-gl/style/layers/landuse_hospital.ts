import type { LayerSpecification } from 'maplibre-gl'

export const landuse_hospital: LayerSpecification = {
  id: 'landuse_hospital',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'hospital'],
  paint: {
    'fill-color': '#fde',
  },
} as LayerSpecification
