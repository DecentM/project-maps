import type { StyleConfig } from '..'

export const site_construction = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-construction',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'construction'],
  paint: {
    'fill-color': 'rgb(169,169,169)',
    'fill-pattern': 'basics:pattern-hatched_thin',
    'fill-opacity': 0.1,
  },
})
