<script lang="ts" setup>
import { Metadata as MetadataService } from '@project-maps/proto/metadata/web'

import { createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'

const transport = createGrpcWebTransport({
  baseUrl: 'http://localhost:8080/metadata',
  useBinaryFormat: true,
  fetch: (i, init) => fetch(i, { ...init, credentials: 'include' }),
})

const client = createClient(MetadataService, transport)

const handleTest = async () => {
  console.log('Sending test request')

  const response = client.getAreaMetadata({
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
    radiusMeters: BigInt(10),
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
