import type { StyleConfig } from '..'

export const way_path = (config: StyleConfig) => ({
  source: 'vector',
  id: 'way-path',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['!=', 'bridge', true], ['!=', 'tunnel', true], ['in', 'kind', 'path']],
  layout: {
    'line-cap': 'round',
  },
  paint: {
    'line-width': {
      stops: [
        [15, 0],
        [16, 4],
        [18, 6],
        [19, 10],
        [20, 20],
      ],
    },
    'line-color': 'rgb(251,235,255)',
  },
  minzoom: 15,
})
