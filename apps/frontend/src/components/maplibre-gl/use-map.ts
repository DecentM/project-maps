import {
  computed,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
  type ShallowRef,
} from 'vue'

import { Map as MaplibreMap, type RequestParameters } from 'maplibre-gl'

import { type StyleDefaults, useStyle } from '@project-maps/map-style'

export const useMap = (
  container: ShallowRef<HTMLDivElement | undefined>,
  styleDefaults: StyleDefaults
) => {
  const map = shallowRef<MaplibreMap | null>(null)

  const { style } = useStyle(styleDefaults)

  watch(style, (newStyle) => {
    map.value?.setStyle(newStyle, {
      diff: false,
    })
  })

  const transformRequest = (url: string): RequestParameters => {
    return {
      url: url
        .replace(/\{tileUrlBase\}/gu, `http://${window.location.hostname}:3000/tile/vector`)
        .replace(/\{spritesUrlBase\}/gu, `http://${window.location.hostname}:3000/icons/sprites`)
        .replace(/\{fontsUrlBase\}/gu, `http://${window.location.hostname}:3000/fonts`)
        .replace(/\{terrainUrlBase\}/gu, `http://${window.location.hostname}:3000/tile/terrain`)
        .replace(/\{tintsUrlBase\}/gu, `http://${window.location.hostname}:3000/tile/tints`),
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
    map.value.setStyle(style.value, {
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
