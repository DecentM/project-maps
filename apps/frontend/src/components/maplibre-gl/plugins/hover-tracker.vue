<template>
  <slot />
</template>

<script lang="ts" setup>
import type { MapGeoJSONFeature, MapMouseEvent, Map as MaplibreGl } from 'maplibre-gl'
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{
  map: MaplibreGl
  modelValue: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null
}>()

const emit =
  defineEmits<
    (
      event: 'update:modelValue',
      value: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null
    ) => void
  >()

const handlePoiHover = (
  event: MapMouseEvent & {
    features?: MapGeoJSONFeature[]
  }
) => {
  if (!event.features?.length) {
    if (props.modelValue) {
      emit('update:modelValue', null)
    }
    return
  }

  const feature = event.features[0]

  if (props.modelValue?.id === String(feature.id)) return

  emit('update:modelValue', feature.toJSON())
}

onMounted(() => {
  props.map.on('mousemove', 'poi_z16', handlePoiHover)
  props.map.on('mousemove', 'poi_z15', handlePoiHover)
  props.map.on('mousemove', 'poi_z14', handlePoiHover)
})

onBeforeUnmount(() => {
  props.map.off('mousemove', 'poi_z16', handlePoiHover)
  props.map.off('mousemove', 'poi_z15', handlePoiHover)
  props.map.off('mousemove', 'poi_z14', handlePoiHover)
})
</script>
