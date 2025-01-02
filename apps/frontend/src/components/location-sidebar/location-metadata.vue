<script lang="ts" setup>
import type { MetadataItem, Address } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'
import WebUrl from '../web-url/web-url.vue'

const props = defineProps<{
  metadata: MetadataItem.AsObject[]
}>()

const addressCount = (address: ReturnType<Address['toObject']>) => {
  return Object.values(address).filter((value) => value).length
}

const textMetadata = computed(() => {
  const item = props.metadata.findLast((item) => 'metadata' in item)

  if (!item || !item.metadata) return null

  return item.metadata
})
</script>

<template>
  <div class="relative-position" v-if="textMetadata">
    <q-item
      v-if="textMetadata.website"
      clickable
      :href="textMetadata.website"
      target="_blank"
      noopener
    >
      <q-item-section side>
        <q-icon name="mdi-web" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">
          <web-url :url="textMetadata.website" />
        </q-item-label>
        <q-item-label caption>Website</q-item-label>
      </q-item-section>
    </q-item>

    <template v-if="textMetadata.address && addressCount(textMetadata.address) > 0">
      <q-item>
        <q-item-section side>
          <q-icon name="mdi-map-marker" color="primary" size="md" />
        </q-item-section>

        <q-item-section class="font-noto-sans-display">
          <q-item-label :lines="addressCount(textMetadata.address)">
            <template v-if="textMetadata.address.country">
              <span>{{ textMetadata.address.country }}</span>
              <br />
            </template>

            <template v-if="textMetadata.address.state">
              <span>{{ textMetadata.address.state }}</span>
              <br />
            </template>

            <template v-if="textMetadata.address.city">
              <span>{{ textMetadata.address.city }}</span>
              <br />
            </template>

            <template v-if="textMetadata.address.street">
              <span>{{ textMetadata.address.street }}</span>
              <br v-if="!textMetadata.address.housenumber" />
              <span v-else>&nbsp;</span>
            </template>

            <template v-if="textMetadata.address.housenumber">
              <span>{{ textMetadata.address.housenumber }}</span>
              <br />
            </template>

            <template v-if="textMetadata.address.postcode">
              <span>{{ textMetadata.address.postcode }}</span>
              <br />
            </template>
          </q-item-label>
          <q-item-label caption>Address</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <q-item v-if="textMetadata.phone" clickable :href="`tel:${textMetadata.phone}`">
      <q-item-section side>
        <q-icon name="mdi-phone" color="primary" size="md" />
      </q-item-section>

      <q-item-section class="font-noto-sans-display">
        <q-item-label>{{ textMetadata.phone }}</q-item-label>
        <q-item-label caption>Phone</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>
