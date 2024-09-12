<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import type { Metadata } from '@project-maps/proto/metadata'
import { useSocket } from 'src/lib/socketio'
import type { Poi } from 'src/lib/poi'

import LocationImage from './location-image.vue'
import LocationMetadata from './location-metadata.vue'
import LocationComments from './location-comments.vue'
import LocationDescription from './location-description.vue'
import LocationAttributions from './location-attributions.vue'
import LocationName from './location-name.vue'
import LocationAmenity from './location-amenity.vue'

import { sortMetadataItems } from 'src/lib/score-metadata-item'

const props = defineProps<{
  poi: Poi | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const { socket } = useSocket()

const metadata = ref<Metadata.MetadataItem[]>([])

onMounted(() => {
  socket.on('Metadata', (method, response) => {
    if (method !== 'GetPoiMetadata') return

    metadata.value = [...metadata.value, response]
  })
})

watch(
  () => props.poi,
  (newPoi) => {
    metadata.value = []

    if (!newPoi) return

    socket.emit('Metadata', 'GetPoiMetadata', newPoi)
  }
)

const hasNameOrDescription = computed(() => {
  return metadata.value.some((item) => 'metadata' in item && item.metadata?.name)
})

const hasAmenity = computed(() => {
  return metadata.value.some((item) => 'metadata' in item && item.metadata?.amenity)
})

const sortedMetadata = computed(() => {
  return sortMetadataItems(metadata.value as Metadata.MetadataItem[])
})
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
      :metadata="sortedMetadata"
    >
      <q-card>
        <q-input :model-value="''" outlined placeholder="Search..." dense />
      </q-card>
    </location-image>

    <q-card-section v-if="hasNameOrDescription">
      <location-name class="text-h6" :metadata="sortedMetadata" />
      <br />
      <location-description class="text-body2" :metadata="sortedMetadata" />
    </q-card-section>

    <q-separator v-if="hasNameOrDescription" />

    <location-amenity v-if="hasAmenity" :metadata="sortedMetadata" />

    <q-separator v-if="hasAmenity" />

    <location-metadata :metadata="sortedMetadata" />
    <location-comments :metadata="sortedMetadata" />
    <location-attributions :metadata="sortedMetadata" />
  </q-card>
</template>
