<script lang="ts" setup>
import { computed } from 'vue'

import type { MetadataItem } from '@project-maps/proto/metadata/web'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const items = computed(() => {
  return props.metadata.filter((metadata) => metadata.attribution)
})

const filteredAttributions = computed(() => {
  // only return the last attribution from each source and name combination
  const seen = new Set<string>()
  return items.value.filter((item) => {
    const key = `${item.attribution!.source}-${item.attribution!.name}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
})
</script>

<template>
  <div v-if="items.length > 0">
    <q-item>
      <q-item-section>
        <q-item-label overline>Attributions</q-item-label>
        <q-item-label caption>
          We've derived this info card from these sources
        </q-item-label>
      </q-item-section>
    </q-item>

    <attribution-notice v-for="(item, index) in filteredAttributions" :key="index" :attribution="item.attribution!" />
  </div>
</template>
