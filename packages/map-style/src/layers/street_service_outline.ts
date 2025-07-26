import type { StyleConfig } from '..'

export const street_service_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-service:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'service'], ['!=', 'bridge', true], ['!=', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(221,220,218)',
    'line-width': {
      stops: [
        [14, 1],
        [16, 3],
        [18, 12],
        [19, 32],
        [20, 48],
      ],
    },
    'line-opacity': {
      stops: [
        [15, 0],
        [16, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
