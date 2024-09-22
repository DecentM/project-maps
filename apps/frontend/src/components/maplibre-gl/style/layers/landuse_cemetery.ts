import type { LayerSpecification } from 'maplibre-gl'

export const landuse_cemetery: LayerSpecification = {
  id: 'landuse_cemetery',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'cemetery'],
  paint: {
    'fill-color': 'hsl(75, 37%, 81%)',
  },
} as LayerSpecification
