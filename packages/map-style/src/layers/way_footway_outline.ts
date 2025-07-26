import type { StyleConfig } from '..'

export const way_footway_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'way-footway:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['!=', 'bridge', true], ['!=', 'tunnel', true], ['in', 'kind', 'footway']],
  layout: {
    'line-cap': 'round',
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
