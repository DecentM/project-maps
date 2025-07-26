import type { StyleConfig } from '..'

export const airport_taxiway = (config: StyleConfig) => ({
  source: 'vector',
  id: 'airport-taxiway',
  type: 'line',
  'source-layer': 'streets',
  filter: ['==', 'kind', 'taxiway'],
  paint: {
    'line-color': 'rgb(255,255,255)',
    'line-width': {
      stops: [
        [13, 0],
        [14, 1],
        [15, 8],
        [16, 12],
        [18, 18],
        [20, 36],
      ],
    },
    'line-opacity': {
      stops: [
        [13, 0],
        [14, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
  },
})
