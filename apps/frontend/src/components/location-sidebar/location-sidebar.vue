<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import type { MetadataItem } from '@project-maps/proto/metadata/web'

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
import { metadataClient } from 'src/lib/rpc'

const props = defineProps<{
  poi: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const metadata = ref<MetadataItem[]>([])

const loading = ref(false)

watch(
  () => props.poi,
  async (newPoi) => {
    metadata.value = []

    if (!newPoi || !newPoi.id) return

    loading.value = true

    const response = metadataClient.getPoiMetadata({
      id: BigInt(newPoi.id),
      coordinates: {
        lat: newPoi.geometry.coordinates[1],
        lng: newPoi.geometry.coordinates[0],
      },
      name:
        newPoi.properties?.name_int || newPoi.properties?.['name:latin'] || newPoi.properties?.name,
    })

    for await (const item of response) {
      metadata.value = [...metadata.value, item]
    }

    loading.value = false
  }
)

const hasNameOrDescription = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'metadata' && item.value.name)
})

const hasAmenity = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'metadata' && item.value.amenity)
})

const hasComments = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'comment' && item.value)
})

const hasWebsite = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'website' && item.value)
})

const hasMetadata = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'metadata' && item.value)
})

const hasOpeningHours = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'openingHours' && item.value)
})

const sortedMetadata = computed(() => {
  return sortMetadataItems(metadata.value as MetadataItem[])
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
