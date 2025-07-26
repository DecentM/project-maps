import type { StyleConfig } from '..'

export const water_pier = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-pier',
  type: 'line',
  'source-layer': 'pier_lines',
  filter: ['in', 'kind', 'pier', 'breakwater', 'groyne'],
  paint: {
    'line-color': 'rgb(249,244,238)',
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
