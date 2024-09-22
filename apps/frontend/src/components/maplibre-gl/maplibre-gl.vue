<script lang="ts" setup>
import { onBeforeUnmount, onMounted, provide, shallowRef, watch } from 'vue'
import type { LngLat, MapLibreEvent } from 'maplibre-gl'

import { useMap } from './use-map'
import { MapSymbol } from './map-symbol'

const props = withDefaults(
  defineProps<{
    center?: [number, number]
    zoom?: number
  }>(),
  {
    center: () => [-1.422504, 53.235409],
    zoom: 16.25,
  }
)

const emit = defineEmits<{
  (event: 'load'): void
  (event: 'move', lngLat: LngLat): void
  (event: 'zoom', zoomLevel: number): void
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
const handleMove = (event: MapLibreEvent) => emit('move', event.target.getCenter())
const handleZoom = (event: MapLibreEvent) => emit('zoom', event.target.getZoom())

onMounted(() => {
  map.value?.on('load', handleLoad)
  map.value?.on('moveend', handleMove)
  map.value?.on('zoomend', handleZoom)
})

onBeforeUnmount(() => {
  map.value?.off('load', handleLoad)
  map.value?.off('moveend', handleMove)
  map.value?.off('zoomend', handleZoom)
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
    <div v-if="$slots.default" class="fit absolute-top-left no-pointer-events">
      <slot :map="map"></slot>
    </div>
  </div>
</template>
