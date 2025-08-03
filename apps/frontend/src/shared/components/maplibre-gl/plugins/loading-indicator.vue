<template>
  <transition name="fade-down" mode="out-in">
    <q-chip v-if="isLoading && loadingForSeconds > 0.4" color="primary" text-color="white">
      <q-spinner indeterminate class="q-mr-sm" />
      Loading - {{ loadingPercent }}%
    </q-chip>
  </transition>
</template>

<script lang="ts" setup>
import type { Map as MaplibreGl } from 'maplibre-gl'
import { type ShallowRef, computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const map = inject<ShallowRef<MaplibreGl>>('map')

const initialised = ref(false)

const highestLoading = ref(0)
const loading = ref(0)
const loadingStartedAt = ref(0)
const now = ref(0)

const handleLoading = () => {
  now.value = performance.now()

  if (loading.value === 0) {
    loadingStartedAt.value = performance.now()
  }

  loading.value++

  if (loading.value > highestLoading.value) {
    highestLoading.value = loading.value
  }
}

const handleLoad = () => {
  now.value = performance.now()

  if (loading.value > 0) {
    loading.value--
  } else {
    highestLoading.value = 0
    loadingStartedAt.value = 0
  }
}

const isLoading = computed(() => loading.value > 0)

const loadingPercent = computed(() => {
  if (highestLoading.value === 0) return 0
  return Math.round(((highestLoading.value - loading.value) / highestLoading.value) * 100)
})

const loadingForSeconds = computed(() => {
  if (loadingStartedAt.value === 0) return 0
  return Math.round((now.value - loadingStartedAt.value) / 1000)
})

const init = (newMap: MaplibreGl) => {
  if (initialised.value) return

  newMap.on('dataloading', handleLoading)
  newMap.on('data', handleLoad)
  newMap.on('dataabort', handleLoad)

  initialised.value = true
}

const dispose = () => {
  if (!map || !map.value) return

  map.value.off('dataloading', handleLoading)
  map.value.off('data', handleLoad)
  map.value.off('dataabort', handleLoad)
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
