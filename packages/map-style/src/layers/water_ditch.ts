import type { StyleConfig } from '..'

export const water_ditch = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-ditch',
  type: 'line',
  'source-layer': 'water_lines',
  filter: ['all', ['in', 'kind', 'ditch'], ['!=', 'tunnel', true], ['!=', 'bridge', true]],
  paint: {
    'line-color': 'rgb(190,221,243)',
    'line-width': {
      stops: [
        [14, 0],
        [15, 1],
        [17, 4],
        [18, 8],
        [20, 20],
      ],
    },
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
