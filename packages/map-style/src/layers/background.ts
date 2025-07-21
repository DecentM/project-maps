import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

import type { StyleConfig } from '..'

export const background = (config: StyleConfig): LayerSpecification => ({
  id: 'background',
  type: 'background',
  paint: { 'background-color': Consts.Colours.background },
})
