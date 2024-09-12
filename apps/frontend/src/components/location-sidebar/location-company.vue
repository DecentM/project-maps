<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { getImageUrl } from 'src/lib/get-image-url'
import { prettifyUrl, sameUrls } from 'src/lib/urls'
import { computed } from 'vue'
import WebUrl from 'src/components/web-url/web-url.vue'

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

    <q-item v-for="link in company.links?.filter((item) => item.url)" :key="link.type" :href="link.url" target="_blank" rel="noopener">
      <q-item-section side>
        <q-icon name="mdi-link" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <web-url :url="link.url!" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />
  </q-list>
</template>
