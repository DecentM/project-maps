<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import type { ImageUrl, MetadataItem } from '@project-maps/proto/metadata/web'

import LocationMetadata from './location-metadata.vue'
import LocationComments from './location-comments.vue'
import LocationAttributions from './location-attributions.vue'
import LocationAmenity from './location-amenity.vue'
import LocationLinks from './location-links.vue'
import LocationOpeningHours from './location-opening-hours.vue'

import ImageRenderer from './metadata-renderers/image-renderer.vue'
import DescriptionRenderer from './metadata-renderers/description-renderer.vue'
import NameRenderer from './metadata-renderers/name-renderer.vue'
import LogoRenderer from './metadata-renderers/logo-renderer.vue'

import { sortMetadataItems } from 'src/lib/score-metadata-item'
import { metadataClient, searchClient } from 'src/lib/rpc'
import ModalCarousel from '../modal-carousel/modal-carousel.vue'
import type { SearchResult } from '@project-maps/proto/search/web'

const props = defineProps<{
  poi: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null
}>()

const metadata = ref<MetadataItem[]>([])

const loading = ref(false)

watch(
  () => props.poi,
  async (newPoi) => {
    searchQuery.value = ''
    metadata.value = []

    if (!newPoi || !newPoi.id) return

    loading.value = true

    console.debug('Fetching metadata for POI:', newPoi)

    try {
      const response = metadataClient.getPoiMetadata({
        id: BigInt(newPoi.id),
        coordinates: {
          lat: newPoi.geometry.coordinates[1],
          lng: newPoi.geometry.coordinates[0],
        },
        name:
          newPoi.properties?.name_int ||
          newPoi.properties?.['name:latin'] ||
          newPoi.properties?.name,
      })

      for await (const item of response) {
        metadata.value.push(item)
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error)
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
  return metadata.value.some(({ item }) => item.case === 'comment' && item.value.text)
})

const hasLinks = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'links' && item.value?.list.length)
})

const hasMetadata = computed(() => {
  return metadata.value.some(
    ({ item }) => item.case === 'metadata' && Object.keys(item.value || {}).length > 2
  )
})

const hasOpeningHours = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'openingHours' && item.value.ranges)
})

const sortedMetadata = computed(() => {
  return sortMetadataItems(metadata.value as MetadataItem[])
})

const carouselEnabled = computed(() => {
  return !!sortedMetadata.value.filter(({ item }) => item.case === 'image').length
})

const carouselOpen = ref(false)

const handleImageClick = () => {
  if (carouselEnabled.value) {
    carouselOpen.value = true
  }
}

const carouselUrls = computed(() => {
  return sortedMetadata.value
    .map(({ item }) => (item.value?.$typeName === 'Metadata.Image' ? item.value.url : null))
    .filter((url): url is ImageUrl => url !== null)
})

const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])

watch(searchQuery, async (newQuery) => {
  const response = searchClient.query({
    query: newQuery,
  })

  const results: SearchResult[] = []

  for await (const item of response) {
    results.push(item)
  }

  searchResults.value = results
})
</script>

<style lang="scss" scoped>
.location-sidebar {
  width: 400px;
  overflow-y: auto;
  max-height: calc(100vh - 32px);
}

.pointer {
  cursor: pointer;
}

.search-results-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>

<template>
  <q-card class="location-sidebar">
    <image-renderer :metadata="sortedMetadata">
      <div class="fit col" :class="{'pointer': carouselEnabled}" @click="handleImageClick">
        <q-card class="font-noto-sans-display">
          <q-input
            v-model="searchQuery"
            outlined
            placeholder="Search..."
            dense
            debounce="300" />

          <q-list v-if="searchQuery && searchResults.length && !props.poi" dense class="search-results-list">
            <q-item
              v-for="(result, index) in searchResults"
              :key="index"
              clickable>
              <q-item-section>
                <q-item-label class="text-description">
                  {{ result.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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

    <location-links v-if="hasLinks" :metadata="sortedMetadata" />
    <q-separator v-if="hasLinks" />

    <location-metadata :metadata="sortedMetadata" />
    <q-separator v-if="hasMetadata" />

    <location-comments :metadata="sortedMetadata" />
    <q-separator v-if="hasComments" />

    <location-opening-hours v-if="poi" :metadata="sortedMetadata" :coordinates="poi.geometry.coordinates" />
    <q-separator v-if="hasOpeningHours" />

    <location-attributions :metadata="sortedMetadata" />

    <q-linear-progress v-if="loading" indeterminate />
  </q-card>

  <modal-carousel
    v-if="carouselEnabled"
    v-model="carouselOpen"
    :urls="carouselUrls" />
</template>
