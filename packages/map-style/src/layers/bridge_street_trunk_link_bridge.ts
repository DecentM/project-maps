import type { StyleConfig } from '..'

export const bridge_street_trunk_link_bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-trunk-link:bridge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'trunk'], ['==', 'link', true]],
  layout: {
    'line-cap': 'butt',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'rgb(244,239,233)',
    'line-opacity': 0.5,
    'line-width': {
      stops: [
        [12, 3],
        [14, 4],
        [16, 10],
        [18, 20],
        [20, 56],
      ],
    },
  },
  minzoom: 13,
})
