<script lang="ts" setup>
import { type Map as MaplibreMap, Marker, type MarkerOptions } from 'maplibre-gl'

import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  type ShallowRef,
  shallowRef,
  watch,
} from 'vue'
import { MapSymbol } from './map-symbol'

const props = withDefaults(
  defineProps<{
    options?: MarkerOptions
    coordinates: [number, number]
  }>(),
  {
    options: () => ({
      offset: [0, 0],
    }),
  }
)

const map = inject<ShallowRef<MaplibreMap>>(MapSymbol)
const container = shallowRef<HTMLDivElement>()

const marker = shallowRef<Marker | null>(null)

onMounted(() => {
  if (!container.value) return

  marker.value = new Marker({
    ...props.options,
    element: container.value,
  })

  // We need to reimplement some of the methods to weed out direct DOM
  // manipulation. Vue freaks out when maplibre-gl moves elements around

  // https://github.com/maplibre/maplibre-gl-js/blob/ba484496604f944606b39ab8d512a2c1d090fc58/src/ui/marker.ts#L346
  marker.value.remove = () => {
    if (!marker.value) return marker.value!

    if (marker.value._opacityTimeout) {
      clearTimeout(marker.value._opacityTimeout)
      Reflect.deleteProperty(marker.value, '_opacityTimeout')
    }

    if (marker.value._map) {
      marker.value._map.off('click', marker.value._onMapClick)
      marker.value._map.off('move', marker.value._update)
      marker.value._map.off('moveend', marker.value._update)
      marker.value._map.off('terrain', marker.value._update)
      marker.value._map.off('projectiontransition', marker.value._update)
      marker.value._map.off('mousedown', marker.value._addDragHandler)
      marker.value._map.off('touchstart', marker.value._addDragHandler)
      marker.value._map.off('mouseup', marker.value._onUp)
      marker.value._map.off('touchend', marker.value._onUp)
      marker.value._map.off('mousemove', marker.value._onMove)
      marker.value._map.off('touchmove', marker.value._onMove)
      Reflect.deleteProperty(marker.value, '_map')
    }

    return marker.value
  }

  // https://github.com/maplibre/maplibre-gl-js/blob/ba484496604f944606b39ab8d512a2c1d090fc58/src/ui/marker.ts#L316
  marker.value.addTo = (map: MaplibreMap) => {
    if (!marker.value) return marker.value!

    marker.value.remove()
    marker.value._map = map

    map.on('move', marker.value._update)
    map.on('moveend', marker.value._update)
    map.on('terrain', marker.value._update)
    map.on('projectiontransition', marker.value._update)

    marker.value.setDraggable(marker.value._draggable)
    marker.value._update()

    return marker.value
  }

  marker.value.setLngLat(props.coordinates)
})

const mapAndMarker = computed(() => [map?.value, marker.value] as const)

watch(mapAndMarker, ([newMap, newMarker]) => {
  if (!newMap || !newMarker) return

  newMarker.addTo(newMap)
})

watch(
  () => props.coordinates,
  (v) => marker.value?.setLngLat(v)
)

watch(
  () => props.options.offset,
  (v) => marker.value?.setOffset(v || [0, 0])
)

watch(
  () => props.options.pitchAlignment,
  (v) => marker.value?.setPitchAlignment(v || 'auto')
)

watch(
  () => props.options.rotationAlignment,
  (v) => marker.value?.setRotationAlignment(v || 'auto')
)

onBeforeUnmount(() => {
  marker.value?.remove()
})
</script>

<template>
  <div
    class="marker-container all-pointer-events"
    ref="container"
  >
    <slot :map="map" :marker="marker" />
  </div>
</template>
