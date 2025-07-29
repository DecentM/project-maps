<script lang="ts" setup>
import { computed, ref, useTemplateRef, watch } from 'vue'

import type { Attribution } from '@project-maps/proto/metadata/web'

import { imageSourceString } from 'src/shared/lib/image-source-string'
import { licenseUrlToString } from 'src/shared/lib/license-url-to-string'

const props = withDefaults(
  defineProps<{
    attribution: Attribution
    static?: boolean
    openWidth?: string
  }>(),
  {
    static: false,
    side: 'right',
    openWidth: '350px',
  }
)

const trigger = useTemplateRef<HTMLElement>('trigger')
const open = ref(false)
const position = ref({ top: 0, left: 0 })

const updatePosition = (newOpen: boolean) => {
  if (!trigger.value || newOpen === false || props.static) return

  const rect = trigger.value.getBoundingClientRect()
  position.value = {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  }
}

watch(open, updatePosition)

const attributionString = computed(() => {
  return `Source: ${props.attribution.name} - ${imageSourceString(props.attribution.source)} (${licenseUrlToString(props.attribution.license)})`
})
</script>

<style lang="scss" scoped>
.transition-background {
  transition: background-color 0.2s ease, color 0.2s ease;
}

.transition-width-opacity {
  transition-property: width, opacity;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
}

.content {
  white-space: nowrap;
  overflow: hidden;
  height: 30px;
  display: flex;
  align-items: center;
  z-index: 1000;
  border-radius: 42px;
  position: absolute;
  pointer-events: none;
  margin-left: 2rem;

  span {
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
</style>

<template>
  <div ref="trigger" :class="{ open }">
    <teleport to="body" :disabled="static">
      <q-card
        v-if="!static"
        bordered
        :style="{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: open ? props.openWidth : '36px',
          opacity: open ? 1 : 0,
        }"
        flat
        class="content transition-width-opacity">
        <span class="text-primary ellipsis">
          <slot>
            {{ attributionString }}
          </slot>
        </span>
      </q-card>

      <q-btn
        v-else
        outline
        color="primary"
        size="md"
        icon="mdi-rhombus-medium"
        dense
        class="bg-white q-pr-sm"
        clickable
        no-caps
        rounded
        :href="attribution.url"
        :target="attribution.url ? '_blank' : undefined"
        :noopener="!!attribution.url"
      >
        <slot>
          {{ attributionString }}
        </slot>
      </q-btn>
    </teleport>

    <q-btn
      v-if="!static"
      size="sm"
      :href="attribution.url"
      :target="attribution.url ? '_blank' : undefined"
      :noopener="!!attribution.url"
      flat
      round
      :color="open ? 'white' : 'grey'"
      icon="mdi-rhombus-medium"
      class="transition-background"
      :class="{ 'bg-white': !open, 'bg-primary': open }"
      @mouseenter="open = true"
      @mouseleave="open = false" />
  </div>
</template>
