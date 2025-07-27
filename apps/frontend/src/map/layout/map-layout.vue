<script lang="ts" setup>
import MaplibreGl from 'src/shared/components/maplibre-gl/maplibre-gl.vue'
</script>

<style lang="scss" scoped>
.sidebar {
  width: 400px;
}
</style>

<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <maplibre-gl
          class="vh-100"
          :min-pitch="0"
          :max-pitch="80"
        >
          <div class="sidebar">
            <router-view name="Topbar" />

            <router-view name="Sidebar" v-slot="{ Component }">
              <transition name="fade-up" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </maplibre-gl>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
