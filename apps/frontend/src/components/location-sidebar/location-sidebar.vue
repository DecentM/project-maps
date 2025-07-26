<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import type { ImageUrl, MetadataItem } from '@project-maps/proto/metadata/web'
import type { SearchResult } from '@project-maps/proto/search/web'

import { metadataClient, searchClient } from 'src/lib/rpc'
import { sortMetadataItems } from 'src/lib/score-metadata-item'
import { useOsmCache } from 'src/lib/osm-cache'

import LocationMetadata from './location-metadata.vue'
import LocationComments from './location-comments.vue'
import LocationAttributions from './location-attributions.vue'
import LocationAmenity from './location-amenity.vue'
import LocationLinks from './location-links.vue'
import LocationOpeningHours from './location-opening-hours.vue'
import DefibrillatorDetails from './defribillator-details.vue'

import ImageRenderer from './metadata-renderers/image-renderer.vue'
import DescriptionRenderer from './metadata-renderers/description-renderer.vue'
import NameRenderer from './metadata-renderers/name-renderer.vue'
import LogoRenderer from './metadata-renderers/logo-renderer.vue'

import ModalCarousel from '../modal-carousel/modal-carousel.vue'

const props = defineProps<{
  poiOsmId?: string
}>()

const metadata = ref<MetadataItem[]>([])

const loading = ref(false)

const osmCache = useOsmCache()

const performSearch = async (osmId: string) => {
  searchQuery.value = ''
  metadata.value = []

  const cached = await osmCache.get('node', osmId)

  if (cached && cached.case === 'node') {
    metadata.value.push({
      $typeName: 'Metadata.MetadataItem',
      item: {
        case: 'metadata',
        value: {
          $typeName: 'Metadata.TextMetadata',
          name: cached.value.tags.name,
          amenity: cached.value.tags.amenity || '',
          phone: cached.value.tags.phone || '',
          ...cached.value.tags,
        },
      },
    })
  }

  if (!osmId) return

  loading.value = true

  try {
    const response = metadataClient.getPoiMetadata({
      id: BigInt(osmId),
    })

    for await (const item of response) {
      metadata.value.push(item)
    }
  } catch (error) {
    console.error('Failed to fetch metadata:', error)
  }

  loading.value = false
}

watch(
  () => props.poiOsmId,
  (newPoiOsmId) => {
    if (newPoiOsmId) {
      performSearch(newPoiOsmId)
    } else {
      metadata.value = []
    }
  }
)

onMounted(() => {
  if (props.poiOsmId) {
    performSearch(props.poiOsmId)
  } else {
    metadata.value = []
  }
})

const hasNameOrDescription = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'metadata' && item.value.name)
})

const hasAmenity = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'metadata' && item.value.amenity)
})

const hasComments = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'comment' && item.value.text)
})

const hasDefibrillator = computed(() => {
  return metadata.value.some(({ item }) => item.case === 'defibrillator' && item.value)
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
  return metadata.value.some(({ item }) => item.case === 'openingHours' && item.value)
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
    .map(({ item }) => (item.case === 'image' ? item.value.url : null))
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

          <q-list v-if="searchQuery && searchResults.length && !props.poiOsmId" dense class="search-results-list">
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

    <defibrillator-details v-if="hasDefibrillator" :metadata="sortedMetadata" />
    <q-separator v-if="hasDefibrillator" />

    <location-links v-if="hasLinks" :metadata="sortedMetadata" />
    <q-separator v-if="hasLinks" />

    <location-metadata :metadata="sortedMetadata" />
    <q-separator v-if="hasMetadata" />

    <location-comments :metadata="sortedMetadata" />
    <q-separator v-if="hasComments" />

    <location-opening-hours :metadata="sortedMetadata" />
    <q-separator v-if="hasOpeningHours" />

    <location-attributions :metadata="sortedMetadata" />

    <q-linear-progress v-if="loading" indeterminate />
  </q-card>

  <modal-carousel
    v-if="carouselEnabled"
    v-model="carouselOpen"
    :urls="carouselUrls" />
</template>
