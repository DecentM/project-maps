import type { StyleConfig } from '..'

export const symbol_transit_lightrail = (config: StyleConfig) => ({
  source: 'vector',
  id: 'symbol-transit-lightrail',
  type: 'symbol',
  'source-layer': 'public_transport',
  filter: ['all', ['in', 'kind', 'station', 'halt'], ['==', 'station', 'light_rail']],
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
        [14, 0.5],
        [16, 1],
      ],
    },
    'symbol-placement': 'point',
    'icon-keep-upright': true,
    'text-font': ['Noto Sans Regular'],
    'text-size': 10,
    'icon-anchor': 'bottom',
    'text-anchor': 'top',
    'icon-image': 'mdi:train-variant',
  },
  paint: {
    'icon-opacity': 0.7,
    'icon-color': 'rgb(102,98,106)',
    'text-color': 'rgb(102,98,106)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 14,
})
