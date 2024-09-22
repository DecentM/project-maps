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
  marker.value = new Marker({
    ...props.options,
    element: container.value,
  })

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
  <div class="marker-container all-pointer-events" ref="container">
    <slot :map="map" :marker="marker" />
  </div>
</template>
