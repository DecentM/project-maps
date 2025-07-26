import type { StyleConfig } from '..'

export const bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge',
  type: 'fill',
  'source-layer': 'bridges',
  paint: {
    'fill-color': 'rgb(244,239,233)',
    'fill-antialias': true,
    'fill-opacity': 0.8,
  },
})
