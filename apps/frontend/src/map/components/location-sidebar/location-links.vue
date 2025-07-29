<script lang="ts" setup>
import { computed } from 'vue'

import type { Attribution, Link, MetadataItem } from '@project-maps/proto/metadata/web'

import { sameUrls } from 'src/shared/lib/urls'
import WebUrl from 'src/shared/components/web-url/web-url.vue'
import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

type LinkWithAttribution = {
  link: Link
  attribution?: Attribution
}

const links = computed<LinkWithAttribution[]>(() => {
  const result = props.metadata.filter(
    ({ item }) => item.case === 'links' && item.value.$typeName === 'Metadata.Links'
  )

  return result.flatMap(({ item, attribution }) => {
    if (item.case !== 'links') {
      return []
    }

    return item.value.list.map((link) => ({
      link,
      attribution,
    }))
  })
})

const deduplicatedLinks = computed<LinkWithAttribution[]>(() => {
  const uniqueLinks: LinkWithAttribution[] = []

  for (const item of links.value) {
    if (!uniqueLinks.some((existingLink) => sameUrls(existingLink.link.url, item.link.url))) {
      uniqueLinks.push(item)
    }
  }

  return uniqueLinks
})
</script>

<template>
  <q-list v-if="deduplicatedLinks.length">
    <q-separator />

    <q-item v-for="{ link, attribution } in deduplicatedLinks" :href="link.url" target="_blank" rel="noopener">
      <q-item-section side>
        <q-icon name="mdi-web" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="ellipsis">
          <web-url :url="link.url" />
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label v-if="attribution">
          <attribution-notice :attribution="attribution" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
