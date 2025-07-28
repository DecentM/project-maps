<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Image, ImageUrl, MetadataItem } from '@project-maps/proto/metadata/web'

import { metadataClient } from 'src/shared/lib/rpc'
import { getImageUrl } from 'src/shared/lib/get-image-url'

import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'
import AttributionControlPlugin from 'src/shared/components/maplibre-gl/plugins/attribution-control.vue'
import NavigationBar from 'src/map/components/top-bar/navigation-bar.vue'
import { getImageSize } from 'src/shared/lib/get-image-size'
import { sortMetadataItems } from 'src/shared/lib/score-metadata-item'

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
      if (item.item.case !== 'image' || !item.item.value.url) {
        continue
      }

      metadata.value.push(item)
    }

    metadata.value = sortMetadataItems(metadata.value)
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

const images = computed<Array<Image & { url: ImageUrl }>>(() => {
  return metadata.value
    .map(({ item }) => item.value as Image)
    .filter((image) => image.url !== undefined) as Array<Image & { url: ImageUrl }>
})

const preview = computed(() => {
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
  useFallbackImage.value = false

  router.push({
    name: 'GalleryPage',
    params: {
      id: id.value,
      index: String(index),
    },
    query: route.query,
  })
}

const useFallbackImage = ref(false)

const handleCanonicalUrlLoaded = async (src: string) => {
  if (useFallbackImage.value) return

  const size = await getImageSize(src)

  // Specific to Geograph, a 320x240 image is a "not available" image
  if (size.width === 320 && size.height === 240) {
    useFallbackImage.value = true
  }
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
  filter: grayscale(50%) brightness(0.5) sepia(10%);
  transform: scale(1);

  &:hover,
  &.active {
    filter: grayscale(0%) brightness(1) sepia(0);
    transform: scale(0.95);
  }
}

.image-view {
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
      <div v-if="images.length > 1" class="col-auto">
        <q-scroll-area style="width: 200px; height: 100%;">
          <q-card v-for="(image, index) in images" class="q-mb-sm bg-secondary">
            <q-img
              v-ripple
              no-spinner
              no-transition
              :key="getImageUrl(image.url, 'medium')"
              class="rounded-borders thumbnail"
              :class="{ active: preview && getImageUrl(image.url, 'medium') === getImageUrl(preview.url, 'medium') }"
              :src="getImageUrl(image.url, 'medium')"
              :ratio="16/9"
              fit="cover"
              @click="() => handlePreviewClick(index)"
            />
          </q-card>
        </q-scroll-area>
      </div>

      <div class="col gallery" :class="{ 'q-ml-sm': images.length > 1 }">
        <transition name="fade-up" mode="out-in">
          <q-carousel
            v-if="preview"
            animated
            infinite
            vertical
            :model-value="getImageUrl(preview.url, 'medium')"
            height="100%"
            class="transparent"
            transition-prev="slide-down"
            transition-next="slide-up"
          >
            <q-carousel-slide
              v-for="image in images"
              :key="getImageUrl(image.url, 'medium')"
              :name="getImageUrl(image.url, 'medium')"
              class="q-pa-none"
            >
              <q-img
                :key="getImageUrl(preview?.url, 'medium')"
                class="rounded-borders image-view"
                :src="useFallbackImage ? getImageUrl(preview?.url, 'medium') : getImageUrl(preview?.url, 'canonical')"
                fit="contain"
                @load="(src) => handleCanonicalUrlLoaded(src)"
              />
            </q-carousel-slide>
          </q-carousel>

        </transition>
      </div>
    </div>

    <attribution-control-plugin />
    <panzoom-tracker-plugin />
  </div>
</template>
