<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { sameUrls } from 'src/lib/urls'
import { computed } from 'vue'
import WebUrl from 'src/components/web-url/web-url.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const website = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'website' && item.value)

  if (!result || !result.item.value || result.item.value.$typeName !== 'Metadata.Website')
    return null

  return result.item.value
})

const textMetadata = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'metadata' && item.value)

  if (!result || !result.item.value || result.item.value.$typeName !== 'Metadata.TextMetadata')
    return null

  return result.item.value
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
