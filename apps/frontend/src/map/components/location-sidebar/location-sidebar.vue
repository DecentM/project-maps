<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import type { MetadataItem } from '@project-maps/proto/metadata/web'

import { metadataClient } from 'src/shared/lib/rpc'
import { sortMetadataItems } from 'src/shared/lib/score-metadata-item'
import { useOsmCache } from 'src/shared/lib/osm-cache'

import LocationMetadata from 'src/map/components/location-sidebar/location-metadata.vue'
import LocationComments from 'src/map/components/location-sidebar/location-comments.vue'
import LocationAttributions from 'src/map/components/location-sidebar/location-attributions.vue'
import LocationLinks from 'src/map/components/location-sidebar/location-links.vue'
import LocationOpeningHours from 'src/map/components/location-sidebar/location-opening-hours.vue'
import DefibrillatorDetails from 'src/map/components/location-sidebar/defribillator-details.vue'

import ImageRenderer from 'src/map/components/location-sidebar/metadata-renderers/image-renderer.vue'
import DescriptionRenderer from 'src/map/components/location-sidebar/metadata-renderers/description-renderer.vue'
import NameRenderer from 'src/map/components/location-sidebar/metadata-renderers/name-renderer.vue'
import LogoRenderer from 'src/map/components/location-sidebar/metadata-renderers/logo-renderer.vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  poiOsmId?: string
}>()

const metadata = ref<MetadataItem[]>([])

const loading = ref(false)

const osmCache = useOsmCache()

const performSearch = async (osmId: string) => {
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
    params: {
      id: props.poiOsmId,
    },
    query: route.query,
  })
}
</script>

<style lang="scss" scoped>
.location-sidebar {
  overflow-y: auto;
  width: 400px;
}

.pointer {
  cursor: pointer;
}

.scroll {
  overflow-y: auto;
  max-height: calc(100vh - 40rem);
}
</style>

<template>
  <q-card class="location-sidebar">
    <image-renderer
      :metadata="sortedMetadata"
      class="pointer"
      @click="handleImageClick" />

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

    <div class="scroll">
      <defibrillator-details :metadata="sortedMetadata" />
      <location-metadata :metadata="sortedMetadata" />
      <location-comments :metadata="sortedMetadata" />
      <location-opening-hours :metadata="sortedMetadata" />
      <location-links :metadata="sortedMetadata" />
    </div>

    <location-attributions :metadata="sortedMetadata" />
    <q-linear-progress v-if="loading" indeterminate />
  </q-card>
</template>
