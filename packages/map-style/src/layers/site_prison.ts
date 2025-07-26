import type { StyleConfig } from '..'

export const site_prison = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-prison',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'prison'],
  paint: {
    'fill-color': 'rgb(253,242,252)',
    'fill-pattern': 'basics:pattern-striped',
    'fill-opacity': 0.1,
  },
})
