<template>
  <slot />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ScaleControl, type Map as MaplibreGl } from 'maplibre-gl'

const props = defineProps<{
  map: MaplibreGl
}>()

const control = ref(
  new ScaleControl({
    maxWidth: 120,
    unit: 'metric', // 'imperial' or 'nautical' can also be used
  })
)

onMounted(() => {
  props.map.addControl(control.value)
})

onBeforeUnmount(() => {
  props.map.removeControl(control.value)
})
</script>
