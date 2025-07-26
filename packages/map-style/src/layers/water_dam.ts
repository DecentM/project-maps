import type { StyleConfig } from '..'

export const water_dam = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-dam',
  type: 'line',
  'source-layer': 'dam_lines',
  filter: ['==', 'kind', 'dam'],
  paint: {
    'line-color': 'rgb(190,221,243)',
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
