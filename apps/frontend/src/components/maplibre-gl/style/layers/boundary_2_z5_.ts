import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

export const boundary_2_z5_: LayerSpecification = {
  id: 'boundary_2_z5-',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'boundary',
  minzoom: 5,
  filter: ['all', ['==', 'admin_level', 2]],
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': Consts.Colours.boundaryOutline,
    'line-opacity': {
      base: 1,
      stops: [
        [0, 0.4],
        [4, 1],
      ],
    },
    'line-width': {
      base: 1,
      stops: [
        [3, 1],
        [5, 1.2],
        [12, 3],
      ],
    },
  },
} as unknown as LayerSpecification
