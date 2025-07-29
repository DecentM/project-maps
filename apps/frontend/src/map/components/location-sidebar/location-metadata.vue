<script lang="ts" setup>
import { computed } from 'vue'

import type { MetadataItem, Address } from '@project-maps/proto/metadata/web'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const addressCount = (address: Address) => {
  let count = 0

  for (const key of ['country', 'state', 'city', 'street', 'housenumber', 'postcode'] as const) {
    if (address[key]) {
      count++
    }
  }

  return count
}

const textMetadata = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'metadata' && item.value)

  if (!result || !result.item || result.item.case !== 'metadata') return null

  return {
    data: result.item.value,
    attribution: result.attribution,
  }
})
</script>

<template>
  <div class="relative-position" v-if="textMetadata">
    <q-separator />

    <template v-if="textMetadata.data.address && addressCount(textMetadata.data.address) > 0">
      <q-item>
        <q-item-section side>
          <q-icon name="mdi-map-marker" color="primary" size="md" />
        </q-item-section>

        <q-item-section>
          <q-item-label :lines="addressCount(textMetadata.data.address)">
            <template v-if="textMetadata.data.address.country">
              <span>{{ textMetadata.data.address.country }}</span>
              <br />
            </template>

            <template v-if="textMetadata.data.address.state">
              <span>{{ textMetadata.data.address.state }}</span>
              <br />
            </template>

            <template v-if="textMetadata.data.address.city">
              <span>{{ textMetadata.data.address.city }}</span>
              <br />
            </template>

            <template v-if="textMetadata.data.address.street">
              <span>{{ textMetadata.data.address.street }}</span>
              <br v-if="!textMetadata.data.address.housenumber" />
              <span v-else>&nbsp;</span>
            </template>

            <template v-if="textMetadata.data.address.housenumber">
              <span>{{ textMetadata.data.address.housenumber }}</span>
              <br />
            </template>

            <template v-if="textMetadata.data.address.postcode">
              <span>{{ textMetadata.data.address.postcode }}</span>
              <br />
            </template>
          </q-item-label>
          <q-item-label caption>Address</q-item-label>
        </q-item-section>

        <q-item-section v-if="textMetadata.attribution" side>
          <q-item-label>
            <attribution-notice :attribution="textMetadata.attribution" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <q-item v-if="textMetadata.data.phone" clickable :href="`tel:${textMetadata.data.phone}`">
      <q-item-section side>
        <q-icon name="mdi-phone" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ textMetadata.data.phone }}</q-item-label>
        <q-item-label caption>Phone</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>
