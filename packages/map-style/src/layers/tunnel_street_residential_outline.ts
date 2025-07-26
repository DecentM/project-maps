import type { StyleConfig } from '..'

export const tunnel_street_residential_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-residential:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'residential'], ['==', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(222,222,222)',
    'line-width': {
      stops: [
        [12, 2],
        [14, 3],
        [16, 6],
        [18, 26],
        [19, 64],
        [20, 128],
      ],
    },
    'line-opacity': {
      stops: [
        [12, 0],
        [13, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
