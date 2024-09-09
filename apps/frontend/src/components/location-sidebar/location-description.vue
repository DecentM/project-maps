<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { computed } from 'vue'

import AttributionNotice from '../attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: ReturnType<Metadata.AreaMetadataItem['toObject']>[]
}>()

const descriptionItem = computed(() => {
  return props.metadata.findLast((item) => 'description' in item)
})
</script>

<template>
  <div v-if="descriptionItem?.description?.text">
    <q-separator />

    <q-item>
      <q-item-section>
        <q-item-label>{{ descriptionItem?.description?.text.slice(0, 1).toLocaleUpperCase() }}{{ descriptionItem?.description?.text.slice(1) }}</q-item-label>
      </q-item-section>
    </q-item>

    <attribution-notice
      v-if="descriptionItem.attribution"
      :attribution="descriptionItem.attribution"
    />
  </div>
</template>
