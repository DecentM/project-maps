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
    tileMetadataUrl: process.env.WEB_TILE_METADATA_URL || 'fixme',
    tileUrlPattern: process.env.WEB_TILE_URL_PATTERN || 'fixme',
    spritesUrl: process.env.WEB_SPRITES_URL || 'fixme',
    fontsUrlPattern: process.env.WEB_FONTS_URL_PATTERN || 'fixme',
    tintsMetadataUrl: process.env.WEB_TINTS_METADATA_URL || 'fixme',
    tintsUrlPattern: process.env.WEB_TINTS_URL_PATTERN || 'fixme',
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
