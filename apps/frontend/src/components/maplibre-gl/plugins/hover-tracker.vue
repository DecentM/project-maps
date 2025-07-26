<template>
  <slot />
</template>

<script lang="ts" setup>
import type { MapGeoJSONFeature, MapMouseEvent, Map as MaplibreGl } from 'maplibre-gl'
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{
  map: MaplibreGl
}>()

const emit = defineEmits<(event: 'poi-click', poi: MapGeoJSONFeature | null) => void>()

const CLICKABLE_LAYERS = [
  'poi-amenity',
  'poi-emergency',
  'poi-historic',
  'poi-leisure',
  'poi-man_made',
  'poi-office',
  'poi-shop',
  'poi-tourism',
] as const

const handlePoiClick = (event: MapMouseEvent) => {
  const features = props.map.queryRenderedFeatures(event.point, {
    layers: [...CLICKABLE_LAYERS],
  })

  if (!features.length) {
    emit('poi-click', null)
    return
  }

  emit('poi-click', features[0])
}

const updateCursor = (hovered: boolean) => {
  if (hovered) {
    props.map.getCanvas().style.cursor = 'pointer'
  } else {
    props.map.getCanvas().style.cursor = ''
  }
}

const handlePoiHover = () => {
  updateCursor(true)
}

const handlePoiUnhover = () => {
  updateCursor(false)
}

onMounted(() => {
  for (const layer of CLICKABLE_LAYERS) {
    props.map.on('mouseenter', layer, handlePoiHover)
    props.map.on('mouseleave', layer, handlePoiUnhover)
    props.map.on('click', layer, handlePoiClick)
  }
})

onBeforeUnmount(() => {
  for (const layer of CLICKABLE_LAYERS) {
    props.map.off('mouseenter', layer, handlePoiHover)
    props.map.off('mouseleave', layer, handlePoiUnhover)
    props.map.off('click', layer, handlePoiClick)
  }
})
</script>
