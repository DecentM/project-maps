import type { StyleConfig } from '..'

export const tunnel_street_track_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-track:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'track'], ['==', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(222,222,222)',
    'line-width': {
      stops: [
        [14, 2],
        [16, 4],
        [18, 18],
        [19, 48],
        [20, 96],
      ],
    },
    'line-opacity': {
      stops: [
        [14, 0],
        [15, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
