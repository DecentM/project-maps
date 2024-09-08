<script lang="ts" setup>
import type { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'
import type { LngLat } from 'maplibre-gl'
import { watch } from 'vue'

import LocationImage from './location-image.vue'
import LocationMetadata from './location-metadata.vue'

const props = defineProps<{
  location: LngLat | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const emit = defineEmits<{
  (event: 'show-image', image: LocationMetadataImages.LocationImage): void
  (event: 'reset-images'): void
}>()

watch(
  () => props.location,
  () => {
    emit('reset-images')
  }
)
</script>

<style lang="scss" scoped>
.location-sidebar {
  width: 400px;
  overflow-y: auto;
  max-height: calc(100vh - 32px);
}
</style>

<template>
  <q-card class="location-sidebar">
    <location-image
      :location="location"
      :zoom-level="zoomLevel"
      :max-zoom-level="maxZoomLevel"
      @show-image="(image) => emit('show-image', image)"
    >
      <q-card>
        <q-input :model-value="''" outlined placeholder="Search..." dense />
      </q-card>
    </location-image>

    <q-separator />

    <q-card-section>
      <location-metadata :location="location" :zoom-level="zoomLevel" :max-zoom-level="maxZoomLevel" />
    </q-card-section>
  </q-card>
</template>
