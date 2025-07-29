<script lang="ts" setup>
import LoadingIndicatorPlugin from 'src/shared/components/maplibre-gl/plugins/loading-indicator.vue'

import ScaleControlPlugin from 'src/shared/components/maplibre-gl/plugins/scale-control.vue'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'
</script>

<template>
  <q-footer class="transparent">
    <q-toolbar>
      <q-space />
      <loading-indicator-plugin />
      <q-space />
      <div class="row q-gutter-sm">
        <attribution-notice static href="https://www.maplibre.org/">
          MapLibre
        </attribution-notice>
        <attribution-notice static href="https://www.openstreetmap.org/copyright">
          © OpenStreetMap contributors
        </attribution-notice>
      </div>
    </q-toolbar>

    <scale-control-plugin />
  </q-footer>
</template>
