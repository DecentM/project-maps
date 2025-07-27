<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleSearch = (query?: string | number | null) => {
  router.push({
    name: 'SearchPage',
    query: {
      ...route.query,
      query: String(query) || '',
    },
  })
}
</script>

<template>
  <div class="q-px-sm q-mt-sm q-gutter-sm">
    <q-card>
      <q-input
        :model-value="''"
        @update:model-value="handleSearch"
        outlined
        placeholder="Search..."
        dense
        debounce="300" />
    </q-card>
  </div>
</template>
