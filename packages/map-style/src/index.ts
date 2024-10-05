import { computed } from 'vue'
import type { LngLat, StyleSpecification } from 'maplibre-gl'

import { config } from './config'
import { sources } from './sources'

import { layers } from './layers'
import { terrain } from './terrain'

export * as Consts from './consts'

export { classToIcon } from './icon-mapping'

export type StyleDefaults = {
  center: LngLat
  zoom: number
}

export const useStyle = (defaults: StyleDefaults) => {
  const style = computed<StyleSpecification>(() => {
    return {
      ...config,
      ...defaults,
      center: [defaults.center.lng, defaults.center.lat],
      sources,
      layers,
      terrain,
    } as const
  })

  return {
    style,
  }
}
