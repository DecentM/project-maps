<template>
  <slot />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { GlobeControl, type Map as MaplibreGl } from 'maplibre-gl'

const props = defineProps<{
  map: MaplibreGl
}>()

onMounted(() => {
  props.map.addControl(new GlobeControl())
})

onBeforeUnmount(() => {
  props.map.removeControl(new GlobeControl())
})
</script>
