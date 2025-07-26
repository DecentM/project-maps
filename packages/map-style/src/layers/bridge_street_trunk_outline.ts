import type { StyleConfig } from '..'

export const bridge_street_trunk_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-trunk:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'trunk'], ['!=', 'link', true]],
  paint: {
    'line-color': 'rgb(233,172,119)',
    'line-width': {
      stops: [
        [7, 0],
        [8, 2],
        [10, 4],
        [14, 6],
        [16, 12],
        [18, 36],
        [19, 74],
        [20, 144],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'butt',
  },
})
