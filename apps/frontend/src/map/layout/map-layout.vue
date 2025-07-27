<script lang="ts" setup>
import MaplibreGl from 'src/shared/components/maplibre-gl/maplibre-gl.vue'
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <maplibre-gl
          class="vh-100"
          :min-pitch="0"
          :max-pitch="80"
        >
          <router-view name="Topbar" v-slot="{ Component }">
            <transition name="fade-up" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>

          <router-view name="Sidebar" v-slot="{ Component }">
            <transition name="fade-up" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </maplibre-gl>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
