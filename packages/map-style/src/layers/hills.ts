import type { LayerSpecification } from 'maplibre-gl'
import type { StyleConfig } from '..'

export const hillshade = (config: StyleConfig): LayerSpecification => ({
  id: 'hillshade',
  type: 'hillshade',
  source: 'terrain',
  minzoom: 5,
  maxzoom: 17,
  layout: { visibility: 'visible' },
  paint: { 'hillshade-shadow-color': 'rgba(71, 59, 36, 0.5)' },
})
