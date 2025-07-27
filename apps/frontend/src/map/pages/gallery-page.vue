<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Image, ImageUrl, MetadataItem } from '@project-maps/proto/metadata/web'

import { metadataClient } from 'src/shared/lib/rpc'
import { getImageUrl } from 'src/shared/lib/get-image-url'

import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'
import AttributionControlPlugin from 'src/shared/components/maplibre-gl/plugins/attribution-control.vue'
import NavigationBar from 'src/map/components/top-bar/navigation-bar.vue'

const router = useRouter()
const route = useRoute()

const id = computed(() => {
  return route.params.id as string
})

const metadata = ref<MetadataItem[]>([])

const loading = ref(false)

const performSearch = async (osmId: string) => {
  metadata.value = []

  if (!osmId) return

  loading.value = true

  try {
    const response = metadataClient.getPoiMetadata({
      id: BigInt(osmId),
      maxImages: 20,
    })

    for await (const item of response) {
      metadata.value.push(item)
    }
  } catch (error) {
    console.error('Failed to fetch metadata:', error)
  }

  loading.value = false
}

watch(id, (newPoiOsmId) => {
  if (newPoiOsmId) {
    performSearch(newPoiOsmId)
  } else {
    metadata.value = []
  }
})

onMounted(() => {
  if (id.value) {
    performSearch(id.value)
  } else {
    metadata.value = []
  }
})

const images = computed<Array<{ small: string; large: string }>>(() => {
  return metadata.value
    .filter(({ item }) => item.case === 'image' && typeof item.value !== 'string')
    .map(({ item }) => item.value as Image)
    .filter((image) => typeof image.url !== 'undefined')
    .map(
      (image) =>
        ({
          small: getImageUrl(image.url as ImageUrl, 'small'),
          large: getImageUrl(image.url as ImageUrl, 'canonical'),
        }) as { small: string; large: string }
    )
})

const previewUrl = computed(() => {
  if (!route.params.index) {
    return images.value[0]
  }

  const index = Array.isArray(route.params.index)
    ? Number.parseInt(route.params.index[0], 10)
    : Number.parseInt(route.params.index, 10)

  if (index < 0 || index >= images.value.length) {
    return undefined
  }

  return images.value[index]
})

const handlePreviewClick = (index: number) => {
  router.push({
    name: 'GalleryPage',
    params: {
      id: id.value,
      index: index.toString(),
    },
    query: route.query,
  })
}
</script>

<style lang="scss" scoped>
.thumbscroll {
  display: block;
  overflow-y: scroll;
  width: 400px;
  max-height: calc(100vh - 20rem);
}

.background {
  background-color: rgba($color: #000000, $alpha: 0.4);
  backdrop-filter: blur(4px);
}

.thumbnail {
  cursor: pointer;
  transition-property: filter, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  filter: grayscale(50%) brightness(0.8);
  transform: scale(1);

  &:hover,
  &.active {
    filter: grayscale(0%) brightness(1);
    transform: scale(0.98);
  }
}

.view {
  max-height: calc(100vh - 5rem);
}
</style>

<template>
  <div class="q-pa-sm vw-100 vh-100 column background absolute-top-left">
    <navigation-bar to-name="DetailsPage" />

    <div v-if="loading" class="col fit justify-center column">
      <q-spinner color="white" size="4rem" class="self-center" indeterminate />
    </div>

    <div v-else class="col row q-pa-sm fit">
      <div class="col-auto">
        <q-scroll-area style="width: 200px; height: 100%;">
          <q-card v-for="(image, index) in images" class="q-mb-sm bg-secondary">
            <q-img
              v-ripple
              no-spinner
              no-transition
              :key="image.large"
              class="rounded-borders thumbnail"
              :class="{ active: previewUrl?.large === image.large }"
              :src="image.small"
              :ratio="16/9"
              fit="cover"
              @click="() => handlePreviewClick(index)"
            />
          </q-card>
        </q-scroll-area>
      </div>

      <div class="col gallery q-ml-sm">
        <transition name="fade-up" mode="out-in">
          <q-img
            v-if="previewUrl"
            :key="previewUrl.large"
            class="rounded-borders view"
            :src="previewUrl.large"
            fit="contain"
          />
        </transition>
      </div>
    </div>

    <attribution-control-plugin />
    <panzoom-tracker-plugin />
  </div>
</template>
