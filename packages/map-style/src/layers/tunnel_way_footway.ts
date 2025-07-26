import type { StyleConfig } from '..'

export const tunnel_way_footway = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-way-footway',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'footway']],
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
    'line-color': 'hsl(288,33%,94%)',
    'line-dasharray': [1, 0.2],
  },
  minzoom: 15,
})
