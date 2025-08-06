<script lang="ts" setup>
import { usePreferredReducedMotion } from '@vueuse/core'
import type { QuasarComponents } from 'quasar'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { Member_Type } from '@project-maps/proto/lib/openstreetmap/web'

import { getImageUrl } from 'src/shared/lib/get-image-url'
import { metadataClient } from 'src/shared/lib/rpc'

import { getImageSize } from 'src/shared/lib/get-image-size'
import { sortMetadataItems } from 'src/shared/lib/score-metadata-item'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const router = useRouter()
const route = useRoute()
const reducedMotion = usePreferredReducedMotion()

const id = computed(() => {
  return route.params.id as string
})

const type = computed(() => {
  return route.params.type as 'node' | 'way' | 'relation'
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
      osmType:
        type.value === 'node'
          ? Member_Type.MEMBER_TYPE_NODE
          : type.value === 'way'
            ? Member_Type.MEMBER_TYPE_WAY
            : Member_Type.MEMBER_TYPE_RELATION,
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

const images = computed(() => {
  return metadata.value
    .filter((image) => image.item.case === 'image' && image.item.value.url !== undefined)
    .map((image) => {
      const url = image.item.case === 'image' ? image.item.value.url : undefined
      if (!url) return

      return {
        url,
        attribution: image.attribution,
      }
    })
    .filter((image) => image !== null)
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

  router.replace({
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
  globalThis.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  globalThis.removeEventListener('keydown', handleKeydown)
})
</script>

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
      height="calc(100vh - 57px)"
      width="100%"
      transition-prev="jump-right"
      transition-next="jump-left"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :model-value="Array.isArray(route.params.index) ? route.params.index[0] : (route.params.index || '0')"
      navigation-position="top"
      @update:model-value="handleCarouselChange"
    >
      <q-carousel-slide
        v-for="(image, index) in images"
        :key="index"
        :name="String(index)"
        class="q-pa-none"
      >
        <q-img
          v-if="image"
          class="fit"
          :src="useFallbackImage ? getImageUrl(image.url, 'medium') : getImageUrl(image.url, 'canonical')"
          fit="contain"
          :no-transition="reducedMotion === 'reduce'"
          :no-spinner="reducedMotion === 'reduce'"
          @load="(src) => handleCanonicalUrlLoaded(src)"
        >
          <attribution-notice
            v-if="image.attribution"
            static
            class="absolute-bottom-right transparent"
            :attribution="image.attribution"
          />
        </q-img>
      </q-carousel-slide>
    </q-carousel>
  </q-card>
</template>
