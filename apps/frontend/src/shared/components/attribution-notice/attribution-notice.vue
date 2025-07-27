<script lang="ts" setup>
import type { Attribution } from '@project-maps/proto/metadata/web'

import { imageSourceString } from 'src/shared/lib/image-source-string'
import { licenseUrlToString } from 'src/shared/lib/license-url-to-string'
import { computed } from 'vue'

const props = defineProps<{
  attribution: Attribution
}>()

const hideSource = computed(() => {
  return (
    !props.attribution.source ||
    props.attribution.name === imageSourceString(props.attribution.source)
  )
})
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
        <q-item-label
          v-if="typeof attribution.source === 'number' && !hideSource"
          caption
        >
          {{ imageSourceString(attribution.source) }}
        </q-item-label>
      </q-item-section>

      <q-item-section
        v-if="attribution.license"
        side
        top
      >
        <q-item-label caption>{{
          licenseUrlToString(attribution.license)
        }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
