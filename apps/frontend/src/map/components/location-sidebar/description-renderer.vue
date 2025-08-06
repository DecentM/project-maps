<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const descriptionItem = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'description' && item.value)

  if (!result || !result.item.value || result.item.case !== 'description') return

  return {
    attribution: result.attribution,
    item: result.item.value,
  }
})
</script>

<template>
  <q-item v-if="descriptionItem">
    <q-item-section>
      <q-item-label>
        {{ descriptionItem?.item.text?.slice(0, 1).toLocaleUpperCase() }}{{ descriptionItem?.item.text?.slice(1) }}
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="descriptionItem?.attribution" avatar>
      <attribution-notice :attribution="descriptionItem.attribution" />
    </q-item-section>
  </q-item>
</template>
