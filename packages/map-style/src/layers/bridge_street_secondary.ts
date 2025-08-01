import type { StyleConfig } from '..'

export const bridge_street_secondary = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-secondary',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'secondary'], ['!=', 'link', true]],
  paint: {
    'line-color': 'rgb(255,238,170)',
    'line-width': {
      stops: [
        [11, 1],
        [14, 4],
        [16, 6],
        [18, 28],
        [19, 64],
        [20, 130],
      ],
    },
    'line-opacity': {
      stops: [
        [11, 0],
        [12, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'butt',
  },
})
