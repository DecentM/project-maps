<script lang="ts" setup>
import type { LocationImages } from '@project-maps/proto/location-images'

import { imageSourceString } from 'src/lib/image-source-string'
import { licenseUrlToString } from 'src/lib/license-url-to-string'

defineProps<{
  attribution: {
    name?: string
    license?: string
    url?: string
    source?: LocationImages.ImageSource
  }
}>()
</script>

<template>
  <q-list bordered separator v-if="attribution.name">
    <q-item clickable v-ripple :href="attribution.url" target="_blank" noopener>
      <q-item-section>
        <q-item-label>{{ attribution.name }}</q-item-label>
        <q-item-label v-if="typeof attribution.source === 'number'" caption>{{ imageSourceString(attribution.source) }}</q-item-label>
      </q-item-section>

      <q-item-section v-if="attribution.license" side top>
        <q-item-label caption>{{ licenseUrlToString(attribution.license) }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
