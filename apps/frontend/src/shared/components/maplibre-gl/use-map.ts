import {
  markRaw,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  shallowRef,
  type ShallowRef,
} from 'vue'

import { Map as MaplibreGl, type MapOptions } from 'maplibre-gl'

import { type StyleConfig, createStyle } from '@project-maps/map-style'

export const useMap = (
  container: ShallowRef<HTMLDivElement | undefined>,
  styleConfig: StyleConfig,
  options: Omit<MapOptions, 'container'> = {}
) => {
  const map = shallowRef<MaplibreGl | null>(null)
  const style = createStyle(styleConfig)

  const init = () => {
    if (map.value || !container.value) return

    const rawMap = new MaplibreGl({
      container: container.value,
      ...options,
    })

    // init map
    map.value = markRaw(rawMap)

    // restart on context lost to prevent blank screen
    map.value.getCanvas().addEventListener('webglcontextlost', restart)

    map.value.setStyle(style, {
      diff: false,
    })
  }

  const dispose = async () => {
    if (!map.value) return

    map.value.getCanvas().removeEventListener('webglcontextlost', restart)

    // destroy map
    map.value.remove()
    map.value = null
  }

  const restart = () => {
    dispose()
    nextTick(init)
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    dispose()
  })

  provide('map', map)
}
