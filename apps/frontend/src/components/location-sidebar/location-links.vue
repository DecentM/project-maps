<script lang="ts" setup>
import { computed } from 'vue'
import type { Link, MetadataItem } from '@project-maps/proto/metadata/web'

import { sameUrls } from 'src/lib/urls'
import WebUrl from 'src/components/web-url/web-url.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const links = computed<Link[]>(() => {
  const result = props.metadata.filter(
    ({ item }) => item.case === 'links' && item.value.$typeName === 'Metadata.Links'
  )

  return result
    .filter(({ item }) => item.case === 'links')
    .flatMap(({ item }) => (item.value?.$typeName === 'Metadata.Links' ? item.value.list : []))
})

const deduplicatedLinks = computed(() => {
  const uniqueLinks: Link[] = []

  for (const link of links.value) {
    if (!uniqueLinks.some((existingLink) => sameUrls(existingLink.url, link.url))) {
      uniqueLinks.push(link)
    }
  }

  return uniqueLinks
})
</script>

<template>
  <q-list v-if="deduplicatedLinks.length">
    <q-item v-for="link in deduplicatedLinks" :href="link.url" target="_blank" rel="noopener">
      <q-item-section side>
        <q-icon name="mdi-web" color="primary" size="md" />
      </q-item-section>

      <q-item-section class="font-noto-sans-display">
        <q-item-label class="ellipsis">
          <web-url :url="link.url" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
