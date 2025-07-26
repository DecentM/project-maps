import type { StyleConfig } from '..'

export const water_stream = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-stream',
  type: 'line',
  'source-layer': 'water_lines',
  filter: ['all', ['in', 'kind', 'stream'], ['!=', 'tunnel', true], ['!=', 'bridge', true]],
  paint: {
    'line-color': 'rgb(190,221,243)',
    'line-width': {
      stops: [
        [13, 0],
        [14, 1],
        [15, 2],
        [17, 6],
        [18, 12],
        [20, 30],
      ],
    },
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
