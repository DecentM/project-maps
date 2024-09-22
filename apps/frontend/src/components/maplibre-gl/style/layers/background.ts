import type { LayerSpecification } from 'maplibre-gl'

export const background: LayerSpecification = {
  id: 'background',
  type: 'background',
  paint: {
    'background-color': 'rgb(239,239,239)',
  },
} as LayerSpecification
