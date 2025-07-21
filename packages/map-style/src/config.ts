import type { StyleSpecification } from 'maplibre-gl'

import * as Consts from './consts'

export const specification: StyleSpecification = {
  version: 8,
  name: 'project-maps',
  sprite: Consts.Urls.sprite,
  glyphs: Consts.Urls.glyphs,
  layers: [],
  sources: {},
}
