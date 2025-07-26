import type { StyleConfig } from '..'

export const bridge_way_steps_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-way-steps:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'steps']],
  layout: {
    'line-cap': 'butt',
  },
  paint: {
    'line-width': {
      stops: [
        [15, 0],
        [16, 5],
        [18, 7],
        [19, 12],
        [20, 22],
      ],
    },
    'line-color': 'rgb(226,212,230)',
  },
  minzoom: 15,
})
