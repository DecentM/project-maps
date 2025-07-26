import type { StyleConfig } from '..'

export const land_waste = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-waste',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'landfill']],
  paint: {
    'fill-color': 'rgb(219,214,189)',
    'fill-opacity': {
      stops: [
        [10, 0],
        [11, 1],
      ],
    },
  },
})
