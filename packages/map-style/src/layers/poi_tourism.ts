import type { StyleConfig } from '..'

export const poi_tourism = (config: StyleConfig) => ({
  source: 'vector',
  id: 'poi-tourism',
  type: 'symbol',
  'source-layer': 'pois',
  filter: ['to-boolean', ['get', 'tourism']],
  minzoom: 16,
  layout: {
    'icon-size': {
      stops: [
        [16, 0.5],
        [19, 0.5],
        [20, 1],
      ],
    },
    'symbol-placement': 'point',
    'icon-optional': true,
    'text-font': ['Noto Sans Regular'],
    'text-field': [
      'coalesce',
      ['get', 'name_int'],
      ['get', 'name_en'],
      ['get', 'name:latin'],
      ['get', 'name'],
    ],
    'icon-anchor': 'bottom',
    'text-size': 10,
    'text-anchor': 'top',
    'icon-image': [
      'match',
      ['get', 'tourism'],
      'chalet',
      'mdi:cabin-a-frame',
      'information',
      'mdi:sign-direction',
      'picnic_site',
      'mdi:table-picnic',
      'viewpoint',
      'mdi:image-filter-hdr',
      'zoo',
      'mdi:elephant',
      '',
    ],
  },
  paint: {
    'icon-opacity': {
      stops: [
        [16, 0],
        [17, 0.4],
      ],
    },
    'text-opacity': {
      stops: [
        [16, 0],
        [17, 0.4],
      ],
    },
    'icon-color': 'rgb(85,85,85)',
    'text-color': 'rgb(85,85,85)',
  },
})
