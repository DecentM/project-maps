<script lang="ts" setup>
import { metadataClient } from 'src/lib/rpc'

const handleTest = async () => {
  console.log('Sending test request')

  const response = metadataClient.getAreaMetadata({
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
    radiusMeters: BigInt(5),
  })

  for await (const item of response) {
    console.log('Received item:', item)
  }

  console.log('Test request completed')
}
</script>

<style lanng="scss" scoped>

</style>

<template>
  <q-btn label="Test" @click="handleTest().catch(console.error)" />
</template>
