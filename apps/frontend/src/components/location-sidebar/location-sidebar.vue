<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { useSocket } from 'src/lib/socketio'

import LocationMetadata from './location-metadata.vue'
import LocationComments from './location-comments.vue'
import LocationAttributions from './location-attributions.vue'
import LocationAmenity from './location-amenity.vue'
import LocationWebsite from './location-website.vue'
import LocationOpeningHours from './location-opening-hours.vue'

import ImageRenderer from './metadata-renderers/image-renderer.vue'
import DescriptionRenderer from './metadata-renderers/description-renderer.vue'
import NameRenderer from './metadata-renderers/name-renderer.vue'
import LogoRenderer from './metadata-renderers/logo-renderer.vue'

import { sortMetadataItems } from 'src/lib/score-metadata-item'

const props = defineProps<{
  poi: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const { socket } = useSocket()

const metadata = ref<MetadataItem.AsObject[]>([])

const loading = ref(false)

onMounted(() => {
  socket.on('Metadata', (method, response, end: boolean) => {
    if (method !== 'GetPoiMetadata') return

    if (end) {
      loading.value = false
      return
    }

    metadata.value = [...metadata.value, response]
  })
})

watch(
  () => props.poi,
  (newPoi) => {
    metadata.value = []

    if (!newPoi) return

    loading.value = true

    socket.emit('Metadata', 'GetPoiMetadata', {
      id: newPoi.id,
      coordinates: {
        lat: newPoi.geometry.coordinates[1],
        lng: newPoi.geometry.coordinates[0],
      },
      name:
        newPoi.properties?.name_int || newPoi.properties?.['name:latin'] || newPoi.properties?.name,
    })
  }
)

const hasNameOrDescription = computed(() => {
  return metadata.value.some((item) => 'metadata' in item && item.metadata?.name)
})

const hasAmenity = computed(() => {
  return metadata.value.some((item) => 'metadata' in item && item.metadata?.amenity)
})

const hasComments = computed(() => {
  return metadata.value.some((item) => 'comment' in item && item.comment)
})

const hasWebsite = computed(() => {
  return metadata.value.some((item) => 'website' in item && item.website)
})

const hasMetadata = computed(() => {
  return metadata.value.some((item) => 'metadata' in item && item.metadata)
})

const hasOpeningHours = computed(() => {
  return metadata.value.some((item) => 'openingHours' in item && item.openingHours)
})

const sortedMetadata = computed(() => {
  return sortMetadataItems(metadata.value as MetadataItem.AsObject[])
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
    <image-renderer :metadata="sortedMetadata">
      <div class="fit col">
        <q-card class="font-noto-sans-display">
          <q-input :model-value="''" outlined placeholder="Search..." dense />
        </q-card>
      </div>
    </image-renderer>

    <q-item v-if="hasNameOrDescription">
      <q-item-section>
        <q-item-label>
          <name-renderer class="text-h6" :metadata="sortedMetadata" />
        </q-item-label>
        <q-item-label caption>
          <description-renderer class="text-body2" :metadata="sortedMetadata" />
        </q-item-label>
      </q-item-section>

      <q-item-section avatar>
        <logo-renderer :metadata="sortedMetadata" width="75px" />
      </q-item-section>
    </q-item>
    <q-separator v-if="hasNameOrDescription" />

    <location-amenity v-if="hasAmenity" :metadata="sortedMetadata" />
    <q-separator v-if="hasAmenity" />

    <location-website :metadata="sortedMetadata" />
    <q-separator v-if="hasWebsite" />

    <location-metadata :metadata="sortedMetadata" />
    <q-separator v-if="hasMetadata" />

    <location-comments :metadata="sortedMetadata" />
    <q-separator v-if="hasComments" />

    <location-opening-hours v-if="poi" :metadata="sortedMetadata" :coordinates="poi.geometry.coordinates" />
    <q-separator v-if="hasOpeningHours" />

    <location-attributions :metadata="sortedMetadata" />

    <q-linear-progress v-if="loading" indeterminate />
  </q-card>
</template>
