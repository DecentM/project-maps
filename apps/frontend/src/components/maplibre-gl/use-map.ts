import {
  computed,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
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

    map.value.setTransformRequest((url, resourceType) => {
      return {
        url: url.replace('{tileUrlBase}', styleConfig.tileUrlBase),
      }
    })

    map.value.setStyle(style, {
      diff: false,
    })
  }

  const dispose = async () => {
    if (!map.value || !canvas.value) return

    canvas.value.removeEventListener('webglcontextlost', restart)

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

  onBeforeUnmount(() => {
    dispose()
  })

  const canvas = computed(() => map.value?.getCanvas())

  return {
    map,
    canvas,
  }
}
