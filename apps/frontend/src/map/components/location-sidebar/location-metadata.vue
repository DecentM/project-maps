<script lang="ts" setup>
import { computed } from 'vue'

import type { Address, MetadataItem } from '@project-maps/proto/metadata/web'

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

  if (!result || !result.item || result.item.case !== 'metadata') return

  return {
    data: result.item.value,
    attribution: result.attribution,
  }
})

const address = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'address' && item.value)

  if (!result || !result.item || result.item.case !== 'address') return

  return {
    data: result.item.value,
    attribution: result.attribution,
  }
})
</script>

<template>
  <div v-if="textMetadata" class="relative-position">
    <q-separator />

    <template v-if="address?.data && addressCount(address.data) > 0">
      <q-item>
        <q-item-section side>
          <q-icon name="mdi-map-marker" color="primary" size="md" />
        </q-item-section>

        <q-item-section>
          <q-item-label :lines="addressCount(address.data)">
            <template v-if="address.data.country || address.data.state">
              <span
                v-if="address.data.country && address.data.state"
              >
                {{ address.data.country }}, {{ address.data.state }}
              </span>

              <span v-else-if="address.data.country">{{ address.data.country }}</span>
              <span v-else="address.data.state">{{ address.data.state }}</span>

              <br >
            </template>

            <template v-if="address.data.city">
              <span>{{ address.data.city }}</span>
              <br >
            </template>

            <template v-if="address.data.street">
              <span>{{ address.data.street }}</span>
              <br v-if="!address.data.housenumber" >
              <span v-else>&nbsp;</span>
            </template>

            <template v-if="address.data.housenumber">
              <span>{{ address.data.housenumber }}</span>
              <br >
            </template>

            <template v-if="address.data.postcode">
              <span>{{ address.data.postcode }}</span>
              <br >
            </template>
          </q-item-label>
          <q-item-label caption>Address</q-item-label>
        </q-item-section>

        <q-item-section v-if="address.attribution" side>
          <q-item-label>
            <attribution-notice :attribution="address.attribution" />
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
