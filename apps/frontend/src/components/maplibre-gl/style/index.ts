import { computed } from 'vue'
import type { StyleSpecification } from 'maplibre-gl'

import { config } from './config'
import { sources } from './sources'

import { layers } from './layers'

export * as Consts from './consts'

export type StyleDefaults = {
  center: [number, number]
  zoom: number
}

export const useStyle = (defaults: StyleDefaults) => {
  const style = computed<StyleSpecification>(() => {
    return {
      ...config,
      ...defaults,
      sources,
      layers,
    } as const
  })

  return {
    style,
  }
}
