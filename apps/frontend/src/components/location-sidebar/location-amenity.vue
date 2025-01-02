<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { getAmenityIcon } from 'src/lib/amenity-icon'
import { computed } from 'vue'

const props = defineProps<{
  metadata: MetadataItem.AsObject[]
}>()

const textMetadata = computed(() => {
  const item = props.metadata.findLast((item) => 'metadata' in item)

  if (!item || !item.metadata) return null

  return item.metadata
})
</script>

<template>
  <q-item v-if="textMetadata?.amenity">
    <q-item-section side>
      <q-icon :name="getAmenityIcon(textMetadata.amenity)" color="primary" size="md" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="font-noto-sans-display">{{ textMetadata.amenity }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
