<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'

import { imageSourceString } from 'src/lib/image-source-string'
import { licenseUrlToString } from 'src/lib/license-url-to-string'

defineProps<{
  attribution: ReturnType<Metadata.Attribution['toObject']>
}>()
</script>

<template>
  <q-list v-if="attribution.name">
    <q-item
      :clickable="!!attribution.url"
      :href="attribution.url ? attribution.url : undefined"
      :target="attribution.url ? '_blank' : undefined"
      :noopener="!!attribution.url"
    >
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
