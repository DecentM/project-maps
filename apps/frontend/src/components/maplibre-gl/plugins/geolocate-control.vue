<template>
  <slot />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { GeolocateControl, type Map as MaplibreGl } from 'maplibre-gl'

const props = defineProps<{
  map: MaplibreGl
}>()

const control = ref(
  new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserLocation: true,
  })
)

onMounted(() => {
  props.map.addControl(control.value)
})

onBeforeUnmount(() => {
  props.map.removeControl(control.value)
})
</script>
