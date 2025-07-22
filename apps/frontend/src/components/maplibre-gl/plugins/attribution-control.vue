<template>
  <slot />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { AttributionControl, type Map as MaplibreGl } from 'maplibre-gl'

const props = defineProps<{
  map: MaplibreGl
}>()

const control = ref(new AttributionControl())

onMounted(() => {
  props.map.addControl(control.value)
})

onBeforeUnmount(() => {
  props.map.removeControl(control.value)
})
</script>
