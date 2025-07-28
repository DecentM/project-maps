<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { searchClient } from 'src/shared/lib/rpc'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

type SearchResult = {
  id: bigint
  name: string
  coordinates?: {
    lat: number
    lng: number
  }
  address: {
    street?: string
    postcode?: string
    municipality?: string
    country?: string
  }
}

const searchResults = ref<SearchResult[]>([])

const query = computed(() => route.query.query as string | undefined)

const performSearch = async (query: string | undefined) => {
  searchResults.value = []

  const response = searchClient.query({
    query,
  })

  for await (const item of response) {
    if (searchResults.value.length >= 10) break // Limit to 10 results

    searchResults.value.push({
      id: item.id,
      name: item.name,
      coordinates: item.coordinates
        ? {
            lat: item.coordinates.lat,
            lng: item.coordinates.lng,
          }
        : undefined,
      address: {
        street: item.address?.road,
        postcode: item.address?.postcode,
        municipality:
          item.address?.city ||
          item.address?.town ||
          item.address?.village ||
          item.address?.hamlet ||
          item.address?.municipality,
        country: item.address?.country,
      },
    })
  }
}

watch(query, (newQuery) => performSearch(newQuery))

onMounted(() => performSearch(query.value))

const handleSearch = (query?: string | number | null) => {
  router.push({
    name: route.name,
    query: {
      ...route.query,
      query: query ? String(query).trim() : undefined,
    },
  })
}

const handleResultClick = (result: SearchResult) => {
  result
}
</script>

<style lang="scss" scoped>
.search-bar {
  width: 400px;
}
</style>

<template>
  <div class="search-bar q-ma-sm">
    <q-card>
      <q-input
        :model-value="query"
        @update:model-value="handleSearch"
        outlined
        placeholder="Search..."
        dense
        debounce="300" />
    </q-card>

    <q-card v-if="query && searchResults.length">
      <q-list class="search-results-list">
        <q-item
          v-for="(result, index) in searchResults"
          :key="index"
          clickable
          @click="() => handleResultClick(result)">
          <q-item-section>
            <q-item-label class="text-description">
              {{ result.name }}
            </q-item-label>

            <q-item-label v-if="result.address.street" caption>
              {{ result.address.street }}
            </q-item-label>

            <q-item-label v-if="result.address.postcode" caption>
              {{ result.address.postcode }}
            </q-item-label>

            <q-item-label v-if="result.address.municipality && !result.address.country" caption>
              {{ result.address.municipality }}
            </q-item-label>

            <q-item-label v-else-if="result.address.municipality && result.address.country" caption>
              {{ result.address.municipality }}, {{ result.address.country }}
            </q-item-label>

            <q-item-label v-else-if="!result.address.municipality && result.address.country" caption>
              {{ result.address.country }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>
