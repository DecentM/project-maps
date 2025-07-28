import type { StyleConfig } from '..'

export const symbol_transit_bus = (config: StyleConfig) => ({
  source: 'vector',
  id: 'symbol-transit-bus',
  type: 'symbol',
  'source-layer': 'public_transport',
  filter: ['==', 'kind', 'bus_stop'],
  layout: {
    'text-field': [
      'coalesce',
      ['get', 'name_int'],
      ['get', 'name_en'],
      ['get', 'name:latin'],
      ['get', 'name'],
    ],
    'icon-size': {
      stops: [
        [16, 0.5],
        [18, 1],
      ],
    },
    'symbol-placement': 'point',
    'icon-keep-upright': true,
    'text-font': ['Noto Sans Regular'],
    'text-size': 10,
    'icon-anchor': 'bottom',
    'text-anchor': 'top',
    'icon-image': 'mdi:bus',
  },
  paint: {
    'icon-opacity': 0.7,
    'icon-color': 'rgb(102,98,106)',
    'text-color': 'rgb(102,98,106)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 16,
})
