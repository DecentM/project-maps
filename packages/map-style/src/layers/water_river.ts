import type { StyleConfig } from '..'

export const water_river = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-river',
  type: 'line',
  'source-layer': 'water_lines',
  filter: ['all', ['in', 'kind', 'river'], ['!=', 'tunnel', true], ['!=', 'bridge', true]],
  paint: {
    'line-color': 'rgb(190,221,243)',
    'line-width': {
      stops: [
        [9, 0],
        [10, 3],
        [15, 5],
        [17, 9],
        [18, 20],
        [20, 60],
      ],
    },
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
