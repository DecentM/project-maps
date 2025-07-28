<script lang="ts" setup>
import { shallowRef } from 'vue'

import { useMap } from './use-map'
import type { MapOptions } from 'maplibre-gl'

const props = defineProps<Pick<MapOptions, 'minPitch' | 'maxPitch'>>()

const container = shallowRef<HTMLDivElement>()

const { loading } = useMap(
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
</script>

<template>
  <div>
    <div v-show="!loading" ref="container" class="fit absolute-top-left"></div>
    <div v-if="loading" class="absolute-top-left fit column justify-center">
      <q-spinner color="primary" size="4rem" class="self-center" indeterminate />
    </div>
    <div v-if="$slots.default" class="absolute-top-left">
      <slot />
    </div>
  </div>
</template>
