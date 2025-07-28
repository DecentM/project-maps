<script lang="ts" setup>
import LoadingIndicatorPlugin from 'src/shared/components/maplibre-gl/plugins/loading-indicator.vue'

import ScaleControlPlugin from 'src/shared/components/maplibre-gl/plugins/scale-control.vue'
import AttributionControlPlugin from 'src/shared/components/maplibre-gl/plugins/attribution-control.vue'
</script>

<template>
  <q-footer class="transparent">
    <q-toolbar>
      <q-space />
      <loading-indicator-plugin />
      <q-space />
    </q-toolbar>

    <attribution-control-plugin />
    <scale-control-plugin />
  </q-footer>
</template>
