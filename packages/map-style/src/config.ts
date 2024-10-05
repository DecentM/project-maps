import type { StyleSpecification } from 'maplibre-gl'

import * as Consts from './consts'

export const specification: StyleSpecification = {
  version: 8,
  name: 'OSM Liberty',
  bearing: 0,
  pitch: 0,
  sprite: Consts.Urls.sprite,
  glyphs: Consts.Urls.glyphs,
  layers: [],
  sources: {},
} as const
