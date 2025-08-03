<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { MetadataItem } from '@project-maps/proto/metadata/web'

import { useOsmCache } from 'src/shared/lib/osm-cache'
import { metadataClient } from 'src/shared/lib/rpc'
import { sortMetadataItems } from 'src/shared/lib/score-metadata-item'

import DefibrillatorDetails from 'src/map/components/location-sidebar/defribillator-details.vue'
import LocationComments from 'src/map/components/location-sidebar/location-comments.vue'
import LocationLinks from 'src/map/components/location-sidebar/location-links.vue'
import LocationMetadata from 'src/map/components/location-sidebar/location-metadata.vue'
import LocationOpeningHours from 'src/map/components/location-sidebar/location-opening-hours.vue'

import DescriptionRenderer from 'src/map/components/location-sidebar/metadata-renderers/description-renderer.vue'
import ImageRenderer from 'src/map/components/location-sidebar/metadata-renderers/image-renderer.vue'
import LogoRenderer from 'src/map/components/location-sidebar/metadata-renderers/logo-renderer.vue'
import NameRenderer from 'src/map/components/location-sidebar/metadata-renderers/name-renderer.vue'

const props = defineProps<{
  poiOsmId?: string
}>()

const metadata = ref<MetadataItem[]>([])

const loading = ref(false)

const osmCache = useOsmCache()

const performSearch = async (osmId: string) => {
  metadata.value = []

  const cached = await osmCache.get('node', osmId)

  if (cached?.case) {
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
      maxImages: 1,
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

const sortedMetadata = computed(() => {
  return sortMetadataItems(metadata.value as MetadataItem[])
})

const router = useRouter()
const route = useRoute()

const handleImageClick = () => {
  router.push({
    name: 'GalleryPage',
    query: route.query,
  })
}
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}

.scroll-limiter {
  max-width: 24rem;
}
</style>

<template>
  <q-card class="fit column">
    <image-renderer
      :metadata="sortedMetadata"
      class="pointer"
      @click="handleImageClick" />

    <q-linear-progress v-if="loading" indeterminate />

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

    <q-scroll-area class="col">
      <div class="scroll-limiter">
        <defibrillator-details :metadata="sortedMetadata" />
        <location-metadata :metadata="sortedMetadata" />
        <location-comments :metadata="sortedMetadata" />
        <location-opening-hours :metadata="sortedMetadata" />
        <location-links :metadata="sortedMetadata" />
      </div>
    </q-scroll-area>
  </q-card>
</template>
