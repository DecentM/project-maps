<script lang="ts" setup>
import type { LocationMetadataOverpass } from '@project-maps/proto/location-metadata/overpass'
import type { LngLat } from 'maplibre-gl'
import { onMounted, ref, watch } from 'vue'

import { useSocket } from 'src/lib/socketio'

const props = defineProps<{
  location: LngLat | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const { socket } = useSocket()

const metadata = ref<ReturnType<
  LocationMetadataOverpass.GetLocationMetadataOutput['toObject']
> | null>(null)

onMounted(() => {
  socket.on('LocationMetadata', (method, response) => {
    if (method !== 'GetLocationMetadata') return

    metadata.value = response
  })
})

watch(
  () => props.location,
  (newLocation) => {
    metadata.value = null

    if (!newLocation) {
      return
    }

    socket.emit('LocationMetadata', 'GetLocationMetadata', {
      coordinates: {
        lat: String(newLocation.lat ?? 0),
        lng: String(newLocation.lng ?? 0),
      },
      radiusMeters: Math.ceil(Math.log(props.maxZoomLevel / props.zoomLevel) * 250 + 10),
    })
  }
)

const renderUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url)

    return `${parsedUrl.hostname}${parsedUrl.pathname === '/' ? '' : parsedUrl.pathname}`
  } catch {
    return url
  }
}

const addressCount = (address: ReturnType<LocationMetadataOverpass.Address['toObject']>) => {
  return Object.values(address).filter((value) => value).length
}
</script>

<template>
  <transition name="fade" mode="out-in">
    <div class="relative-position" v-if="metadata">
      <q-item-label v-if="metadata.name" header>{{ metadata.name }}</q-item-label>

      <q-item
        v-if="metadata.website"
        clickable
        :href="metadata.website"
        target="_blank"
        noopener
      >
        <q-item-section side>
          <q-icon name="mdi-web" color="primary" size="md" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ renderUrl(metadata.website) }}</q-item-label>
          <q-item-label caption>Website</q-item-label>
        </q-item-section>
      </q-item>

      <template v-if="metadata.address && addressCount(metadata.address) > 0">
        <q-item>
          <q-item-section side>
            <q-icon name="mdi-map-marker" color="primary" size="md" />
          </q-item-section>

          <q-item-section>
            <q-item-label :lines="addressCount(metadata.address)">
              <template v-if="metadata.address.country">
                <span>{{ metadata.address.country }}</span>
                <br />
              </template>

              <template v-if="metadata.address.state">
                <span>{{ metadata.address.state }}</span>
                <br />
              </template>

              <template v-if="metadata.address.city">
                <span>{{ metadata.address.city }}</span>
                <br />
              </template>

              <template v-if="metadata.address.street">
                <span>{{ metadata.address.street }}</span>
                <br v-if="!metadata.address.housenumber" />
                <span v-else>&nbsp;</span>
              </template>

              <template v-if="metadata.address.housenumber">
                <span>{{ metadata.address.housenumber }}</span>
                <br />
              </template>

              <template v-if="metadata.address.postcode">
                <span>{{ metadata.address.postcode }}</span>
                <br />
              </template>
            </q-item-label>
            <q-item-label caption>Address</q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <q-item v-if="metadata.phone" clickable :href="`tel:${metadata.phone}`">
        <q-item-section side>
          <q-icon name="mdi-phone" color="primary" size="md" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ metadata.phone }}</q-item-label>
          <q-item-label caption>Phone</q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <q-card-section v-else>
      <slot />
    </q-card-section>
  </transition>
</template>
