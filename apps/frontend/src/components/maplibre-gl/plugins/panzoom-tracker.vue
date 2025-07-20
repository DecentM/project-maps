<template>
  <slot />
</template>

<script lang="ts" setup>
import type { Map as MaplibreGl, MapMouseEvent } from 'maplibre-gl'
import { onBeforeUnmount, onMounted } from 'vue'

export type PanZoom = {
  center: [string, string]
  zoom: string
}

const props = defineProps<{
  map: MaplibreGl
  modelValue: PanZoom
}>()

const emit = defineEmits<(event: 'update:modelValue', value: PanZoom) => void>()

const ZOOM_ACCURACY = 3
const CENTER_ACCURACY = 6

const handleMoveEnd = (event: MapMouseEvent) => {
  const newCenter = event.target.getCenter()

  if (
    newCenter.lat.toFixed(CENTER_ACCURACY) === props.modelValue?.center[1] &&
    newCenter.lng.toFixed(CENTER_ACCURACY) === props.modelValue?.center[0]
  )
    return

  const newZoom = event.target.getZoom()

  if (newZoom.toFixed(ZOOM_ACCURACY) === props.modelValue.zoom) return

  emit('update:modelValue', {
    center: [newCenter.lng.toFixed(CENTER_ACCURACY), newCenter.lat.toFixed(CENTER_ACCURACY)],
    zoom: newZoom.toFixed(ZOOM_ACCURACY),
  })
}

onMounted(() => {
  props.map.setZoom(Number.parseFloat(props.modelValue.zoom))

  props.map.setCenter({
    lng: Number.parseFloat(props.modelValue.center[0]),
    lat: Number.parseFloat(props.modelValue.center[1]),
  })

  props.map.on('moveend', handleMoveEnd)
  props.map.on('zoomend', handleMoveEnd)
})

onBeforeUnmount(() => {
  props.map.off('moveend', handleMoveEnd)
  props.map.off('zoomend', handleMoveEnd)
})
</script>
