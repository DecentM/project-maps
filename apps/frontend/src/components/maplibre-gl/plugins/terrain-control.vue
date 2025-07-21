<template>
  <slot />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { TerrainControl, type Map as MaplibreGl } from 'maplibre-gl'

const props = defineProps<{
  map: MaplibreGl
}>()

const control = ref(
  new TerrainControl({
    source: 'terrain',
    exaggeration: 1,
  })
)

onMounted(() => {
  props.map.addControl(control.value)
})

onBeforeUnmount(() => {
  props.map.removeControl(control.value)
})
</script>
