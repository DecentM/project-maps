<script lang="ts" setup>
import { type Map as MaplibreGl, NavigationControl } from 'maplibre-gl'
import { type ShallowRef, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const map = inject<ShallowRef<MaplibreGl>>('map')

const control = ref(
  new NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true,
  })
)

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

<template>
  <slot />
</template>
