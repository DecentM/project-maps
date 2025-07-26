import type { StyleConfig } from '..'

export const building_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'building:outline',
  type: 'fill',
  'source-layer': 'buildings',
  paint: {
    'fill-color': 'rgb(223,219,215)',
    'fill-opacity': {
      stops: [
        [14, 0],
        [15, 1],
      ],
    },
  },
})
