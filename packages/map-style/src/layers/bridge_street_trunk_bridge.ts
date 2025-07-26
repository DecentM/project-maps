import type { StyleConfig } from '..'

export const bridge_street_trunk_bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-trunk:bridge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'trunk'], ['!=', 'link', true]],
  layout: {
    'line-cap': 'butt',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'rgb(244,239,233)',
    'line-opacity': 0.5,
    'line-width': {
      stops: [
        [7, 0],
        [8, 3],
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
