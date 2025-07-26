import type { StyleConfig } from '..'

export const bridge_street_trunk_link_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-trunk-link:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'trunk'], ['==', 'link', true]],
  paint: {
    'line-color': 'rgb(233,172,119)',
    'line-width': {
      stops: [
        [12, 2],
        [14, 3],
        [16, 7],
        [18, 14],
        [20, 40],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'butt',
  },
  minzoom: 13,
})
