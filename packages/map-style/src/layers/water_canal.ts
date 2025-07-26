import type { StyleConfig } from '..'

export const water_canal = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-canal',
  type: 'line',
  'source-layer': 'water_lines',
  filter: ['all', ['in', 'kind', 'canal'], ['!=', 'tunnel', true], ['!=', 'bridge', true]],
  paint: {
    'line-color': 'rgb(190,221,243)',
    'line-width': {
      stops: [
        [9, 0],
        [10, 2],
        [15, 4],
        [17, 8],
        [18, 17],
        [20, 50],
      ],
    },
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
