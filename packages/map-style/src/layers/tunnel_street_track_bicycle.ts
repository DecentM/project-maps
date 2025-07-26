import type { StyleConfig } from '..'

export const tunnel_street_track_bicycle = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-track-bicycle',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'track'], ['==', 'bicycle', 'designated'], ['==', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(247,247,247)',
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
