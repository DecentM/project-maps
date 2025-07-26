import type { StyleConfig } from '..'

export const tunnel_transport_subway_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-transport-subway:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'subway'], ['!has', 'service'], ['==', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(166,184,199)',
    'line-width': {
      stops: [
        [11, 0],
        [12, 1],
        [15, 3],
        [16, 3],
        [18, 6],
        [19, 8],
        [20, 10],
      ],
    },
    'line-opacity': {
      stops: [
        [11, 0],
        [12, 0.5],
      ],
    },
  },
})
