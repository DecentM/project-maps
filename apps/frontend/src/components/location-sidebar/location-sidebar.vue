<script lang="ts" setup>
import type { LocationImages } from '@project-maps/proto/location-images'
import type { LngLat } from 'maplibre-gl'
import { computed, onMounted, ref, watch } from 'vue'

import PatientImage from '../image/patient-image.vue'
import ImageAttribution from '../image/image-attribution.vue'

import { useSocket } from 'src/lib/socketio'

const props = defineProps<{
  location: LngLat | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const { socket } = useSocket()

const images = ref<ReturnType<LocationImages.LocationImage['toObject']>[]>([])

const firstImage = computed(() => images.value[0] ?? null)

onMounted(() => {
  socket.on('LocationImages', (method, response) => {
    images.value = [...images.value, response]
    emit('show-image', response)
  })
})

const emit = defineEmits<{
  (event: 'show-image', image: LocationImages.LocationImage): void
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

    socket.emit('LocationImages', 'GetLocationImages', {
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
      <div v-if="firstImage && firstImage.url">
        <patient-image
          height="250px"
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
        </patient-image>

        <image-attribution v-if="firstImage.attribution" :attribution="firstImage.attribution" />
      </div>

      <q-card-section v-else>
        <q-input :model-value="''" outlined placeholder="Search..." dense />
      </q-card-section>
    </transition>
  </q-card>
</template>
