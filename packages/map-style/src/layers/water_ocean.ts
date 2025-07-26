import type { StyleConfig } from '..'

export const water_ocean = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-ocean',
  type: 'fill',
  'source-layer': 'ocean',
  paint: {
    'fill-color': 'rgb(190,221,243)',
  },
})
