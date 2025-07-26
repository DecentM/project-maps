import type { StyleConfig } from '..'

export const land_sand = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-sand',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'beach', 'sand']],
  paint: {
    'fill-color': 'rgb(250,250,237)',
  },
})
