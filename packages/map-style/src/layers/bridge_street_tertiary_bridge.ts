import type { StyleConfig } from '..'

export const bridge_street_tertiary_bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-tertiary:bridge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'tertiary'], ['!=', 'link', true]],
  layout: {
    'line-cap': 'butt',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'rgb(244,239,233)',
    'line-opacity': {
      stops: [
        [12, 0],
        [13, 1],
      ],
    },
    'line-width': {
      stops: [
        [12, 3],
        [14, 4],
        [16, 8],
        [18, 36],
        [19, 90],
        [20, 179],
      ],
    },
  },
})
