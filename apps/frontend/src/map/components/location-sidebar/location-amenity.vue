<script lang="ts" setup>
import { computed } from 'vue'

import type { MetadataItem } from '@project-maps/proto/metadata/web'

import { getAmenityIcon } from 'src/shared/lib/amenity-icon'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const textMetadata = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'metadata' && item.value)

  if (!result || !result.item || result.item.case !== 'metadata') return null

  return result.item.value
})
</script>

<template>
  <q-item v-if="textMetadata?.amenity">
    <q-item-section side>
      <q-icon :name="getAmenityIcon(textMetadata.amenity)" color="primary" size="md" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ textMetadata.amenity }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
