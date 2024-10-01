<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { sameUrls } from 'src/lib/urls'
import { computed } from 'vue'
import WebUrl from 'src/components/web-url/web-url.vue'

const props = defineProps<{
  metadata: ReturnType<Metadata.MetadataItem['toObject']>[]
}>()

const website = computed(() => {
  const item = props.metadata.findLast((item) => 'website' in item)

  if (!item || !item.website) return null

  return item.website
})

const textMetadata = computed(() => {
  const item = props.metadata.findLast((item) => 'metadata' in item)

  if (!item || !item.metadata) return null

  return item.metadata
})

const url = computed(() => {
  return website.value?.url
})
</script>

<template>
  <q-list v-if="url">
    <q-item v-if="url && !sameUrls(url, textMetadata?.website)" :href="url" target="_blank" rel="noopener">
      <q-item-section side>
        <q-icon name="mdi-web" color="primary" size="md" />
      </q-item-section>

      <q-item-section class="font-noto-sans-display">
        <q-item-label>
          <web-url :url="url" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
