<script lang="ts" setup>
import { computed, ref, useTemplateRef, watch } from 'vue'

import { type Attribution, Attribution_Source } from '@project-maps/proto/metadata/web'

import { imageSourceString } from 'src/shared/lib/image-source-string'
import { licenseUrlToString } from 'src/shared/lib/license-url-to-string'

const props = withDefaults(
  defineProps<{
    attribution?: Attribution
    static?: boolean
    openWidth?: string
    href?: string
  }>(),
  {
    attribution: undefined,
    href: undefined,
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
  if (!props.attribution) return 'No attribution available'

  const imageSource = imageSourceString(props.attribution.source)
  if (!imageSource) return `Source: ${props.attribution.name}`

  const license = licenseUrlToString(props.attribution.license)
  if (!license) return `Source: ${props.attribution.name} - ${imageSource}`

  return `Source: ${props.attribution.name} - ${imageSource} (${licenseUrlToString(props.attribution.license)})`
})

const attributionMap: { [key in Attribution_Source]: string } = {
  [Attribution_Source.GeographUK]: 'mdi-rhombus-medium',
  [Attribution_Source.Wikimapia]: 'mdi-rhombus-medium',
  [Attribution_Source.Unknown]: 'mdi-rhombus-medium',
  [Attribution_Source.Mapillary]: 'si-mapillary',
  [Attribution_Source.OpenStreetMap]: 'si-openstreetmap',
  [Attribution_Source.Wikidata]: 'si-wikidata',
  [Attribution_Source.Website]: 'mdi-web',
  [Attribution_Source.Nominatim]: 'mdi-book-outline',
  [Attribution_Source.BBC]: 'mdi-newspaper', // si is missing the BBC logo, see https://github.com/simple-icons/simple-icons/issues/10831
}

const attributionLogo = computed(() => {
  if (!props.attribution) return 'mdi-rhombus-medium'

  return attributionMap[props.attribution.source] || 'mdi-rhombus-medium'
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
        dense
        class="bg-white q-pr-sm"
        clickable
        no-caps
        rounded
        :href="attribution?.url || props.href"
        :target="(attribution?.url || props.href) ? '_blank' : undefined"
        :noopener="!!attribution?.url || !!props.href"
      >
        <q-icon left :name="attributionLogo" class="q-ml-sm" size="xs" />

        <slot>
          {{ attributionString }}
        </slot>
      </q-btn>
    </teleport>

    <q-btn
      v-if="!static && attribution"
      size="sm"
      :href="attribution?.url || props.href"
      :target="(attribution?.url || props.href) ? '_blank' : undefined"
      :noopener="!!attribution?.url || !!props.href"
      flat
      round
      :color="open ? 'white' : 'grey'"
      :icon="attributionLogo"
      class="transition-background"
      :class="{ 'bg-white': !open, 'bg-primary': open }"
      @mouseenter="open = true"
      @mouseleave="open = false" />
  </div>
</template>
