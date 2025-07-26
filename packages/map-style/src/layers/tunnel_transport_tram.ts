import type { StyleConfig } from '..'

export const tunnel_transport_tram = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-transport-tram',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'tram'], ['!has', 'service'], ['==', 'tunnel', true]],
  minzoom: 13,
  paint: {
    'line-width': {
      stops: [
        [13, 0],
        [16, 1],
        [17, 2],
        [18, 3],
        [20, 5],
      ],
    },
    'line-color': 'rgb(177,187,196)',
  },
})
