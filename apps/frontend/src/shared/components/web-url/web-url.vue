<script lang="ts" setup>
import { splitUrl } from 'src/shared/lib/urls'
import { computed } from 'vue'

const props = defineProps<{
  url: string
}>()

const parts = computed(() => {
  const [domain, path] = splitUrl(props.url)

  return [domain, decodeURIComponent(path || '')]
})
</script>

<template>
  <template v-if="parts.length === 2 && parts[1] !== '/'">
    <span>{{ parts[0] }}</span><span class="text-grey-7">{{ parts[1] }}</span>
  </template>

  <template v-else-if="parts[1] === '/'">
    <span>{{ parts[0] }}</span>
  </template>

  <template v-else>
    <span>{{ props.url }}</span>
  </template>
</template>
