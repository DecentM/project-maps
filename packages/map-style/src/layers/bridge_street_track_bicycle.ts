import type { StyleConfig } from '..'

export const bridge_street_track_bicycle = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-track-bicycle',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'track'], ['==', 'bicycle', 'designated'], ['==', 'bridge', true]],
  paint: {
    'line-color': 'rgb(255,255,255)',
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'butt',
  },
})
