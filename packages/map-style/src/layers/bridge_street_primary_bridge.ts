import type { StyleConfig } from '..'

export const bridge_street_primary_bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-primary:bridge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'primary'], ['!=', 'link', true]],
  layout: {
    'line-cap': 'butt',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'rgb(244,239,233)',
    'line-opacity': 0.5,
    'line-width': {
      stops: [
        [8, 0],
        [9, 1],
        [10, 6],
        [14, 8],
        [16, 17],
        [18, 50],
        [19, 104],
        [20, 202],
      ],
    },
  },
})
