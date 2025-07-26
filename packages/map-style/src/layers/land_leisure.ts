import type { StyleConfig } from '..'

export const land_leisure = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-leisure',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'miniature_golf', 'playground', 'golf_course']],
  paint: {
    'fill-color': 'rgb(231,237,222)',
  },
})
