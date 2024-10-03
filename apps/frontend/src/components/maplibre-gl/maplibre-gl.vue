<script lang="ts" setup>
import { onBeforeUnmount, onMounted, provide, shallowRef, watch } from 'vue'
import { LngLat, type MapLibreEvent } from 'maplibre-gl'

import { useMap } from './use-map'
import { MapSymbol } from './map-symbol'

const props = withDefaults(
  defineProps<{
    center?: LngLat
    zoom?: number
  }>(),
  {
    center: () => new LngLat(0, 0),
    zoom: 16.25,
  }
)

const emit = defineEmits<{
  (event: 'load'): void
  (event: 'moveend', lngLat: LngLat): void
  (event: 'zoomend', zoomLevel: number): void
  (event: 'click'): void
}>()

const container = shallowRef<HTMLDivElement>()

const { map } = useMap(container, {
  center: props.center,
  zoom: props.zoom,
})

watch(map, (newMap) => {
  if (!newMap) return

  newMap.once('load', (event) => {
    event.target.setCenter(props.center)
    event.target.setZoom(props.zoom)
  })
})

const handleLoad = () => emit('load')
const handleMoveEnd = (event: MapLibreEvent) => emit('moveend', event.target.getCenter())
const handleZoomEnd = (event: MapLibreEvent) => emit('zoomend', event.target.getZoom())
const handleClick = () => emit('click')

onMounted(() => {
  map.value?.on('load', handleLoad)
  map.value?.on('moveend', handleMoveEnd)
  map.value?.on('zoomend', handleZoomEnd)
  map.value?.on('click', handleClick)
})

onBeforeUnmount(() => {
  map.value?.off('load', handleLoad)
  map.value?.off('moveend', handleMoveEnd)
  map.value?.off('zoomend', handleZoomEnd)
  map.value?.off('click', handleClick)
})

watch(
  () => props.center,
  (center) => map.value?.setCenter(center)
)

watch(
  () => props.zoom,
  (zoom) => map.value?.setZoom(zoom)
)

provide(MapSymbol, map)
</script>

<template>
  <div class="position-relative">
    <div ref="container" class="fit absolute-top-left"></div>
    <div v-if="$slots.default" class="fit absolute-top-left no-pointer-events overflow-hidden">
      <slot :map="map"></slot>
    </div>
  </div>
</template>
