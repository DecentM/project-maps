<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

import HeroImage from 'src/components/image/hero-image.vue'
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
  <div class="relative-position" v-if="firstImageUrl">
    <hero-image
      :height="250"
      :src="firstImageUrl"
      alt="Street Photo"
      class="q-pa-md"
    >
      <slot />
    </hero-image>
  </div>

  <div v-else class="q-pa-md">
    <slot />
  </div>
</template>
