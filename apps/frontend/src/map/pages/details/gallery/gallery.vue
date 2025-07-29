<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { QuasarComponents } from 'quasar'
import { usePreferredReducedMotion } from '@vueuse/core'

import type { Image, ImageUrl, MetadataItem } from '@project-maps/proto/metadata/web'

import { metadataClient } from 'src/shared/lib/rpc'
import { getImageUrl } from 'src/shared/lib/get-image-url'

import { getImageSize } from 'src/shared/lib/get-image-size'
import { sortMetadataItems } from 'src/shared/lib/score-metadata-item'

const router = useRouter()
const route = useRoute()
const reducedMotion = usePreferredReducedMotion()

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

const useFallbackImage = ref(false)

const handleCanonicalUrlLoaded = async (src: string) => {
  if (useFallbackImage.value) return

  const size = await getImageSize(src)

  // Specific to Geograph, a 320x240 image is a "not available" image
  if (size.width === 320 && size.height === 240) {
    useFallbackImage.value = true
  }
}

const handleCarouselChange = (index: string | number) => {
  const indexNumber = typeof index === 'number' ? index : Number.parseInt(index, 10)

  if (Number.isNaN(indexNumber)) {
    return
  }

  router.push({
    name: 'GalleryPage',
    query: route.query,
    params: {
      index: indexNumber,
    },
  })
}

const carousel = useTemplateRef<QuasarComponents['QCarousel']>('carousel')

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      router.push({
        name: 'DetailsPage',
        query: route.query,
      })
      break
    case 'ArrowLeft':
      carousel.value?.previous()
      break
    case 'ArrowRight':
      carousel.value?.next()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.thumbscroll {
  display: block;
  overflow-y: scroll;
  width: 400px;
  max-height: calc(100vh - 20rem);
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
</style>

<template>
  <q-card class="fit">
    <q-carousel
      ref="carousel"
      class="bg-dark"
      :arrows="images.length > 1"
      :navigation="images.length > 1"
      navigation-icon="mdi-circle-medium"
      navigation-active-icon="mdi-circle"
      :animated="reducedMotion !== 'reduce'"
      infinite
      swipeable
      height="calc(100vh - 4rem)"
      width="100%"
      transition-prev="jump-right"
      transition-next="jump-left"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :model-value="Array.isArray(route.params.index) ? route.params.index[0] : (route.params.index || '0')"
      @update:model-value="handleCarouselChange"
    >
      <q-carousel-slide
        v-for="(image, index) in images"
        :key="index"
        :name="String(index)"
        class="q-pa-none"
      >
        <q-img
          class="fit"
          :src="useFallbackImage ? getImageUrl(image.url, 'medium') : getImageUrl(image.url, 'canonical')"
          fit="contain"
          @load="(src) => handleCanonicalUrlLoaded(src)"
          :no-transition="reducedMotion === 'reduce'"
          :no-spinner="reducedMotion === 'reduce'"
        />
      </q-carousel-slide>
    </q-carousel>
  </q-card>
</template>
