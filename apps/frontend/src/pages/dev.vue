<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { QueryParameters } from '@project-maps/proto/search'
// biome-ignore lint/style/useNodejsImportProtocol: Not imported from Node, but the browser version of the Buffer package
import { Buffer } from 'buffer'

const a = ref('')

onMounted(() => {
  a.value = Buffer.from(QueryParameters.fromObject({ query: 'test' }).serialize()).toString('hex')
})
</script>

<style lanng="scss" scoped>

</style>

<template>
  <h1>Boo {{ a }}</h1>
</template>
