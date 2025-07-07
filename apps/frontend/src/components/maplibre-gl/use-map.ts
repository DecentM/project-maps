import {
  computed,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  type ShallowRef,
} from 'vue'

import { Map as MaplibreMap, type RequestParameters } from 'maplibre-gl'

import { type StyleConfig, createStyle } from '@project-maps/map-style'

export const useMap = (
  container: ShallowRef<HTMLDivElement | undefined>,
  styleConfig: StyleConfig
) => {
  const map = shallowRef<MaplibreMap | null>(null)
  const style = createStyle(styleConfig)

  const transformRequest = (url: string): RequestParameters => {
    return {
      url: url
        .replace(/\{tileUrlBase\}/gu, process.env.WEB_VECTOR_TILE_BASE_URL || 'fixme')
        .replace(/\{spritesUrlBase\}/gu, process.env.WEB_SPRITES_BASE_URL || 'fixme')
        .replace(/\{fontsUrlBase\}/gu, process.env.WEB_FONTS_BASE_URL || 'fixme')
        .replace(/\{terrainUrlBase\}/gu, process.env.WEB_TERRAIN_BASE_URL || 'fixme')
        .replace(/\{tintsUrlBase\}/gu, process.env.WEB_TINTS_BASE_URL || 'fixme'),
    }
  }

  const init = () => {
    if (map.value || !container.value) return

    // init map
    map.value = markRaw(
      new MaplibreMap({
        container: container.value,
        antialias: true,
        attributionControl: false,
      })
    )

    // restart on context lost to prevent blank screen
    map.value.getCanvas().addEventListener('webglcontextlost', restart)

    // set initial style
    map.value.setTransformRequest(transformRequest)
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
