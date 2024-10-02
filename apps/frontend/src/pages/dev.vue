<script lang="ts" setup>
import MaplibreGl from 'src/components/maplibre-gl/maplibre-gl.vue'
import MapMarker from 'src/components/maplibre-gl/map-marker.vue'
import MapDataLayer from 'src/components/maplibre-gl/map-data-layer.vue'

import { classToIcon } from 'src/components/maplibre-gl/style/icon-mapping'
</script>

<style lanng="scss" scoped>
.poi {
  transform-origin: top center;
  max-width: 128px;
}

.poi-avatar {
  outline: 1px solid lightgrey;
}
</style>

<template>
  <maplibre-gl class="vh-100" :center="[-2.001740, 53.364973]">
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

    <map-data-layer :layers="['data_z14', 'data_z15', 'data_z16']" :limit="50">
      <template #poi="{ poi }">
        <div class="poi column items-center text-center cursor-pointer">
          <q-avatar
            v-if="poi.properties && poi.properties.class in classToIcon"
            :icon="classToIcon[poi.properties.class]"
            text-color="primary"
            size="sm"
            font-size="large"
            color="white"
            class="poi-avatar"
          />

          <q-avatar
            v-else
            icon="mdi-alert"
            text-color="white"
            size="sm"
            color="red"
            class="poi-avatar"
          />

          <span
            class="text-grey-9 font-noto-sans-display text-italic text-caption text-outline-white"
          >
            {{
              poi.properties?.["name_int"] ||
              poi.properties?.["name:latin"] ||
              poi.properties?.["name"]
            }}
          </span>
        </div>
      </template>
    </map-data-layer>
  </maplibre-gl>
</template>
