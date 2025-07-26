import type { StyleConfig } from '..'

export const label_place_village = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-place-village',
  type: 'symbol',
  'source-layer': 'place_labels',
  filter: ['==', 'kind', 'village'],
  layout: {
    'text-field': '{name_en}',
    'text-font': ['Noto Sans Regular'],
    'text-size': {
      stops: [
        [9, 11],
        [12, 14],
      ],
    },
  },
  paint: {
    'icon-color': 'rgb(40,48,73)',
    'text-color': 'rgb(40,48,73)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 11,
})
