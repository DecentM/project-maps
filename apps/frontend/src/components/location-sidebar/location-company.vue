<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { getImageUrl } from 'src/lib/get-image-url'
import { computed } from 'vue'

const props = defineProps<{
  metadata: ReturnType<Metadata.MetadataItem['toObject']>[]
}>()

const company = computed(() => {
  const item = props.metadata.findLast((item) => 'company' in item)

  if (!item || !item.company) return null

  return item.company
})

const textMetadata = computed(() => {
  const item = props.metadata.findLast((item) => 'metadata' in item)

  if (!item || !item.metadata) return null

  return item.metadata
})

const companyLogo = computed(() => {
  return company.value?.logo ? getImageUrl(company.value.logo, 'small') : null
})

const prettifyUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url)

    return `${parsedUrl.hostname}${parsedUrl.pathname === '/' ? '' : parsedUrl.pathname}`
  } catch {
    return url
  }
}

const sameUrls = (url1?: string, url2?: string) => {
  if (!url1 || !url2) return false

  try {
    const parsedUrl1 = new URL(url1)
    const parsedUrl2 = new URL(url2)

    return parsedUrl1.hostname === parsedUrl2.hostname
  } catch {
    return url1 === url2
  }
}
</script>

<template>
  <q-list v-if="company">
    <q-item v-if="company.name">
      <q-item-section side>
        <q-icon name="mdi-domain" color="primary" size="md" />
      </q-item-section>

      <q-item-section v-if="company.logo || company.name">
        <q-img
          v-if="companyLogo"
          no-spinner
          :src="companyLogo"
          height="20px"
          fit="contain"
          position="center left"
        />
        <q-item-label v-else>{{ company.name }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-if="company.websiteUrl && !sameUrls(company.websiteUrl, textMetadata?.website)" :href="company.websiteUrl" target="_blank" rel="noopener">
      <q-item-section side>
        <q-icon name="mdi-web" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          {{ prettifyUrl(company.websiteUrl) }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-for="link in company.links?.filter(Boolean)" :key="link.type" :href="link.url" target="_blank" rel="noopener">
      <q-item-section side>
        <q-icon name="mdi-link" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          {{ prettifyUrl(link.url!) }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />
  </q-list>
</template>
