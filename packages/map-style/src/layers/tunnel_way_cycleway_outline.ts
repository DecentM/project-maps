import type { StyleConfig } from '..'

export const tunnel_way_cycleway_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-way-cycleway:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'cycleway']],
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
    'line-color': 'hsl(203,11%,87%)',
  },
  minzoom: 15,
})
