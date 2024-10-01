<script lang="ts" setup>
import MaplibreGl from 'src/components/maplibre-gl/maplibre-gl.vue'
import MapMarker from 'src/components/maplibre-gl/map-marker.vue'
import MapPoiLayer from 'src/components/maplibre-gl/map-poi-layer.vue'

import { classToIcon } from 'src/components/maplibre-gl/style/icon-mapping'
</script>

<template>
  <maplibre-gl class="vh-100">
    <map-marker
      :coordinates="[-1.422504, 53.235409]"
      :options="{ offset: [0, 0] }"
    >
      <template #default>
        <q-btn
          flat
          dense
          round
        >
          <q-icon color="primary" size="xl" name="mdi-map-marker" />
        </q-btn>
      </template>
    </map-marker>

    <map-poi-layer>
      <template #poi="{ poi }">
        <q-chip v-if="poi.properties" outline>
          <q-avatar
            :icon="classToIcon[poi.properties.class]"
            color="primary"
            text-color="white"
          />
          {{ poi.properties["name_int"] || poi.properties["name:latin"] }}
        </q-chip>

        <q-chip v-else>
          <q-avatar icon="mdi-warn" color="red" text-color="white" />
        </q-chip>
      </template>
    </map-poi-layer>
  </maplibre-gl>
</template>
