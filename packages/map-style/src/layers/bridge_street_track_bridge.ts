import type { StyleConfig } from '..'

export const bridge_street_track_bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-track:bridge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'track'], ['==', 'bridge', true]],
  layout: {
    'line-cap': 'butt',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'rgb(244,239,233)',
    'line-opacity': {
      stops: [
        [14, 0],
        [15, 1],
      ],
    },
    'line-width': {
      stops: [
        [14, 3],
        [16, 6],
        [18, 25],
        [19, 67],
        [20, 134],
      ],
    },
  },
})
