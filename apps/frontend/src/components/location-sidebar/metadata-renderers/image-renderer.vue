<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

import { getImageUrl } from 'src/lib/get-image-url'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const firstItem = computed(() => {
  const result = props.metadata.find(({ item }) => item.case === 'image' && item.value)

  if (!result || !result.item || result.item.case !== 'image') return null

  return result.item.value
})

const firstImageUrl = computed(() => {
  if (!firstItem.value?.url) return null

  return getImageUrl(firstItem.value.url, 'medium')
})
</script>

<template>
  <div v-if="firstImageUrl">
    <q-img
      height="250px"
      :src="firstImageUrl"
      alt="Street Photo"
      class="q-pa-md"
    >
      <slot />
    </q-img>
  </div>

  <div v-else>
    <slot />
  </div>
</template>
