import type { StyleConfig } from '..'

export const bridge_way_cycleway = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-way-cycleway',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'cycleway']],
  layout: {
    'line-cap': 'butt',
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
    'line-color': 'rgb(239,249,255)',
  },
  minzoom: 15,
})
