<script lang="ts" setup>
import type { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'
import type { LngLat } from 'maplibre-gl'
import { computed, onMounted, ref, watch } from 'vue'

import HeroImage from '../image/hero-image.vue'
import ImageAttribution from '../image/image-attribution.vue'

import { useSocket } from 'src/lib/socketio'

const props = defineProps<{
  location: LngLat | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const { socket } = useSocket()

const images = ref<ReturnType<LocationMetadataImages.LocationImage['toObject']>[]>([])
const firstImage = computed(() => images.value[0] ?? null)

const emit =
  defineEmits<(event: 'show-image', image: LocationMetadataImages.LocationImage) => void>()

onMounted(() => {
  socket.on('LocationMetadata', (method, response) => {
    if (method !== 'GetLocationImages') return

    images.value = [...images.value, response]
    emit('show-image', response)
  })
})

watch(
  () => props.location,
  (newLocation) => {
    images.value = []

    if (!newLocation) {
      return
    }

    socket.emit('LocationMetadata', 'GetLocationImages', {
      pagination: {
        limit: 1,
        offset: 0,
      },
      coordinates: {
        lat: String(newLocation.lat ?? 0),
        lng: String(newLocation.lng ?? 0),
      },
      radiusMeters: Math.ceil(Math.log(props.maxZoomLevel / props.zoomLevel) * 250 + 10),
    })
  }
)
</script>

<template>
  <transition name="fade" mode="out-in">
    <div class="relative-position" v-if="firstImage && firstImage.url">
      <hero-image
        :height="250"
        :src="firstImage.url"
        alt="Street Photo"
        class="q-pa-md"
      >
        <slot />
      </hero-image>

      <image-attribution v-if="firstImage.attribution" :attribution="firstImage.attribution" />
    </div>

    <q-card-section v-else>
      <slot />
    </q-card-section>
  </transition>
</template>
