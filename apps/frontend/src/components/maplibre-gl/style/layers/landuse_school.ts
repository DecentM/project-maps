import type { LayerSpecification } from 'maplibre-gl'

export const landuse_school: LayerSpecification = {
  id: 'landuse_school',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'school'],
  paint: {
    'fill-color': 'rgb(236,238,204)',
  },
} as LayerSpecification
