<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { computed } from 'vue'

import HeroImage from 'src/components/image/hero-image.vue'
import { getImageUrl } from 'src/lib/get-image-url'

const props = defineProps<{
  metadata: ReturnType<Metadata.MetadataItem['toObject']>[]
}>()

const firstItem = computed(() => {
  const item = props.metadata.find((item) => 'image' in item)

  if (!item || !item.image) return null

  return item
})

const firstImageUrl = computed(() => {
  if (!firstItem.value?.image?.url) return null

  return getImageUrl(firstItem.value.image.url, 'medium')
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
