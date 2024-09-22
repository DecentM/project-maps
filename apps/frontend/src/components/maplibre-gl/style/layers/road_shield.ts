import type { LayerSpecification } from 'maplibre-gl'

export const road_shield: LayerSpecification = {
  id: 'road_shield',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'transportation_name',
  minzoom: 7,
  filter: ['all', ['<=', 'ref_length', 6]],
  layout: {
    'icon-image': 'default_{ref_length}',
    'icon-rotation-alignment': 'viewport',
    'symbol-placement': {
      base: 1,
      stops: [
        [10, 'point'],
        [11, 'line'],
      ],
    },
    'symbol-spacing': 500,
    'text-field': '{ref}',
    'text-font': ['Roboto Regular'],
    'text-offset': [0, 0.1],
    'text-rotation-alignment': 'viewport',
    'text-size': 10,
    'icon-size': 0.8,
  },
} as unknown as LayerSpecification
