<script lang="ts" setup>
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

import { useMap } from './use-map'

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
  (event: 'move'): void
  (event: 'zoom'): void
}>()

const container = shallowRef<HTMLDivElement>()

const { map } = useMap(container, {
  center: props.center,
  zoom: props.zoom,
})

watch(map, (newMap, oldMap) => {
  if (!newMap || oldMap) return

  newMap.once('load', (event) => {
    event.target.setCenter(props.center)
    event.target.setZoom(props.zoom)
  })
})

const handleLoad = () => emit('load')
const handleMove = () => emit('move')
const handleZoom = () => emit('zoom')

onMounted(() => {
  map.value?.on('load', handleLoad)
  map.value?.on('move', handleMove)
  map.value?.on('zoom', handleZoom)
})

onBeforeUnmount(() => {
  map.value?.off('load', handleLoad)
  map.value?.off('move', handleMove)
  map.value?.off('zoom', handleZoom)
})

watch(
  () => props.center,
  (center) => map.value?.setCenter(center)
)

watch(
  () => props.zoom,
  (zoom) => map.value?.setZoom(zoom)
)
</script>

<template>
  <div>
    <div ref="container" class="fit"></div>
    <slot></slot>
  </div>
</template>
