import type { StyleConfig } from '..'

export const street_unclassified_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-unclassified:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'unclassified'], ['!=', 'bridge', true], ['!=', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(207,205,202)',
    'line-width': {
      stops: [
        [12, 2],
        [14, 3],
        [16, 6],
        [18, 26],
        [19, 64],
        [20, 128],
      ],
    },
    'line-opacity': {
      stops: [
        [12, 0],
        [13, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
