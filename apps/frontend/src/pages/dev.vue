<script lang="ts" setup>
import MaplibreGl from 'src/components/maplibre-gl/maplibre-gl.vue'
import MapMarker from 'src/components/maplibre-gl/map-marker.vue'
import MapPoiLayer from 'src/components/maplibre-gl/map-poi-layer.vue'

import { classToIcon } from 'src/components/maplibre-gl/style/icon-mapping'
</script>

<style lanng="scss" scoped>
.poi-card {
  transform-origin: top center;
}
</style>

<template>
  <maplibre-gl class="vh-100">
    <map-marker
      :coordinates="[-1.422504, 53.235409]"
      :options="{ offset: [0, 0] }"
    >
      <template #default>
        <q-btn flat dense round>
          <q-icon color="primary" size="xl" name="mdi-map-marker" />
        </q-btn>
      </template>
    </map-marker>

    <map-poi-layer>
      <template #poi="{ poi }">
        <q-card
          v-if="poi.properties && poi.properties.class in classToIcon"
          flat
          class="column bg-transparent items-center text-center poi-card"
        >
          <q-avatar
            :icon="classToIcon[poi.properties.class]"
            text-color="primary"
            size="sm"
            font-size="large"
          />

          {{ poi.properties["name_int"] || poi.properties["name:latin"] }}
        </q-card>

        <q-card
          v-else
          flat
          class="column bg-transparent items-center text-center poi-card"
        >
          <q-avatar
            icon="mdi-circle"
            text-color="red"
            size="sm"
          />

          {{ poi.properties?.["name_int"] || poi.properties?.["name:latin"] }}
          <br/>
          {{ poi.properties?.class ? `Unmapped class! (${poi.properties.class})` : '' }}
        </q-card>
      </template>
    </map-poi-layer>
  </maplibre-gl>
</template>
