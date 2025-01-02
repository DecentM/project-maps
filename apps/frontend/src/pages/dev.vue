<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'

import { useSocket } from 'src/lib/socketio'
import { Backend } from 'src/lib/socketio-services'

const { socket } = useSocket()

const backend = new Backend(socket)

const handleTest = () => {
  console.log('Sending test request')

  const events = backend.getAreaMetadata({
    radiusmeters: 5,
    coordinates: {
      lat: 51.504696,
      lng: -0.121622,
    },
  })

  events.on('data', (data: MetadataItem.AsObject) => {
    console.log('test data:', data)
  })
}
</script>

<style lanng="scss" scoped>

</style>

<template>
  <q-btn label="Test" @click="handleTest" />
</template>
