import type { StyleConfig } from '..'

export const bridge_street_service = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-service',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'service'], ['==', 'bridge', true]],
  paint: {
    'line-color': 'rgb(247,247,247)',
    'line-width': {
      stops: [
        [14, 1],
        [16, 2],
        [18, 10],
        [19, 28],
        [20, 40],
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
    'line-cap': 'butt',
  },
})
