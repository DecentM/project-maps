<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

import { getImageUrl } from 'src/shared/lib/get-image-url'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const firstItem = computed(() => {
  const result = props.metadata.find(({ item }) => item.case === 'image' && item.value)

  if (!result || !result.item || result.item.case !== 'image') return

  return result
})

const firstImageUrl = computed(() => {
  if (firstItem.value?.item.case !== 'image') return

  if (!firstItem.value.item.value?.url) return

  return getImageUrl(firstItem.value.item.value.url, 'medium')
})

const imageCount = computed(() => {
  return props.metadata.filter(({ item }) => item.case === 'image').length
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
      <div v-if="firstItem?.attribution" class="absolute-bottom-right transparent">
        <attribution-notice :attribution="firstItem.attribution" />
      </div>

      <div v-if="imageCount > 1" class="absolute-bottom-left transparent no-pointer-events">
        <q-chip class="q-ma-none">
          <q-avatar icon="mdi-plus" color="secondary" text-color="white" />
          Click for more images...
        </q-chip>
      </div>
    </q-img>
  </div>

  <div v-else>
    <slot />
  </div>
</template>
