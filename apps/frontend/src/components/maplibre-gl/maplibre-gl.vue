<script lang="ts" setup>
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

import { useMap } from './use-map'
import type { MapOptions } from 'maplibre-gl'

const props = defineProps<Pick<MapOptions, 'minPitch' | 'maxPitch'>>()

const emit = defineEmits<(event: 'click') => void>()

const container = shallowRef<HTMLDivElement>()

const { map } = useMap(
  container,
  {
    variant: 'light',
    tileUrlBase: process.env.WEB_VECTOR_TILE_BASE_URL || 'fixme',
    spritesUrlBase: process.env.WEB_SPRITES_BASE_URL || 'fixme',
    fontsUrlBase: process.env.WEB_FONTS_BASE_URL || 'fixme',
    terrainUrlBase: process.env.WEB_TERRAIN_BASE_URL || 'fixme',
    tintsUrlBase: process.env.WEB_TINTS_BASE_URL || 'fixme',
  },
  {
    hash: false,
    attributionControl: false,
    minPitch: props.minPitch,
    maxPitch: props.maxPitch,
  }
)

const handleClick = () => emit('click')

onMounted(() => {
  map.value?.on('click', handleClick)
})

onBeforeUnmount(() => {
  map.value?.off('click', handleClick)
})
</script>

<style lang="scss" scoped>
.position-relative {
  background-color: black;
}
</style>

<template>
  <div class="position-relative">
    <div ref="container" class="fit absolute-top-left"></div>
    <div v-if="$slots.default" class="fit absolute-top-left no-pointer-events overflow-hidden">
      <slot :map="map" />
    </div>
  </div>
</template>
