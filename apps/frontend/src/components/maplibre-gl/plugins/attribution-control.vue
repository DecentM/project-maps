<template>
  <slot />
</template>

<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, ref, watch, type ShallowRef } from 'vue'
import { AttributionControl, type Map as MaplibreGl } from 'maplibre-gl'

const map = inject<ShallowRef<MaplibreGl>>('map')

const control = ref(new AttributionControl())

const initialised = ref(false)

const init = (newMap: MaplibreGl) => {
  if (initialised.value) return

  if (!newMap.hasControl(control.value)) {
    newMap.addControl(control.value)
  }

  initialised.value = true
}

const dispose = () => {
  if (!map || !map.value) return

  if (map.value.hasControl(control.value)) {
    map.value.removeControl(control.value)
  }
}

if (map) {
  watch(map, (newMap) => {
    if (newMap) {
      init(newMap)
    }
  })

  onMounted(() => {
    if (map.value) {
      init(map.value)
    }
  })
}

onBeforeUnmount(() => dispose())
</script>
