import type { StyleConfig } from '..'

export const land_rock = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-rock',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'bare_rock', 'scree', 'shingle']],
  paint: {
    'fill-color': 'rgb(224,228,229)',
  },
})
