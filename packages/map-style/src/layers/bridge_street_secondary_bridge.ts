import type { StyleConfig } from '..'

export const bridge_street_secondary_bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-secondary:bridge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'secondary'], ['!=', 'link', true]],
  layout: {
    'line-cap': 'butt',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'rgb(244,239,233)',
    'line-opacity': {
      stops: [
        [11, 0],
        [12, 1],
      ],
    },
    'line-width': {
      stops: [
        [11, 3],
        [14, 7],
        [16, 11],
        [18, 42],
        [19, 95],
        [20, 193],
      ],
    },
  },
})
