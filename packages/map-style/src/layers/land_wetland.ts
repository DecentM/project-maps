import type { StyleConfig } from '..'

export const land_wetland = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-wetland',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'bog', 'marsh', 'string_bog', 'swamp']],
  paint: {
    'fill-color': 'rgb(211,230,219)',
  },
})
