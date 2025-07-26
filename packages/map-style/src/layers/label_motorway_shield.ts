import type { StyleConfig } from '..'

export const label_motorway_shield = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-motorway-shield',
  type: 'symbol',
  'source-layer': 'street_labels',
  filter: ['==', 'kind', 'motorway'],
  layout: {
    'text-field': '{ref}',
    'text-font': ['noto_sans_bold'],
    'symbol-placement': 'line',
    'text-anchor': 'center',
    'text-size': {
      stops: [
        [14, 10],
        [18, 12],
        [20, 16],
      ],
    },
  },
  paint: {
    'icon-color': 'rgb(255,255,255)',
    'text-color': 'rgb(255,255,255)',
    'text-halo-color': 'rgb(255,204,136)',
    'text-halo-width': 0.1,
    'text-halo-blur': 1,
  },
  minzoom: 14,
})
