import type { StyleConfig } from '..'

export const tunnel_way_steps_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-way-steps:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'steps']],
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
    'line-color': 'hsl(288,13%,86%)',
  },
  minzoom: 15,
})
