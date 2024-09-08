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

onMounted(() => {
  socket.on('LocationMetadata', (method, response) => {
    if (method !== 'GetLocationImages') return

    images.value = [...images.value, response]
    emit('show-image', response)
  })
})

const emit = defineEmits<{
  (event: 'show-image', image: LocationMetadataImages.LocationImage): void
  (event: 'reset-images'): void
}>()

watch(
  () => props.location,
  (newLocation) => {
    images.value = []
    emit('reset-images')

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

<style lang="scss" scoped>
.location-sidebar {
  width: 400px;
  overflow-y: auto;
  max-height: calc(100vh - 32px);
}
</style>

<template>
  <q-card class="location-sidebar">
    <transition name="fade" mode="out-in">
      <div v-if="firstImage && firstImage.url" class="relative-position">
        <hero-image
          :height="250"
          :src="firstImage.url"
          alt="Street Photo"
          class="q-pa-md"
        >
          <q-input
            class="bg-white rounded-borders all-pointer-events"
            :model-value="''"
            outlined
            placeholder="Search..."
            dense
          />
        </hero-image>

        <image-attribution v-if="firstImage.attribution" :attribution="firstImage.attribution" />
      </div>

      <q-card-section v-else>
        <q-input :model-value="''" outlined placeholder="Search..." dense />
      </q-card-section>
    </transition>

    <q-separator />

    <q-card-section>
      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Photos</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>View all</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
