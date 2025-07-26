import type { StyleConfig } from '..'

export const airport_taxiway_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'airport-taxiway:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['==', 'kind', 'taxiway'],
  paint: {
    'line-color': 'rgb(207,205,202)',
    'line-width': {
      stops: [
        [13, 0],
        [14, 2],
        [15, 10],
        [16, 14],
        [18, 20],
        [20, 40],
      ],
    },
  },
  layout: {
    'line-join': 'round',
  },
})
