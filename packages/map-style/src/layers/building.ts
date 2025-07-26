import type { StyleConfig } from '..'

export const building = (config: StyleConfig) => ({
  source: 'vector',
  id: 'building',
  type: 'fill',
  'source-layer': 'buildings',
  paint: {
    'fill-color': 'rgb(242,234,226)',
    'fill-opacity': {
      stops: [
        [14, 0],
        [15, 1],
      ],
    },
    'fill-translate': [-2, -2],
  },
})
