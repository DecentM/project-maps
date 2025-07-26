<script lang="ts" setup>
import type { MetadataItem, Address } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

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

  return result.item.value
})
</script>

<template>
  <div class="relative-position" v-if="textMetadata">
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
