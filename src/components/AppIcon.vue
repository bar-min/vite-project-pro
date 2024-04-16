<script setup lang="ts">
import { shallowRef, computed, watch, defineAsyncComponent, defineOptions } from 'vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '20px'
  },
  width: {
    type: String
  },
  height: {
    type: String
  },
  dir: {
    type: String,
    default: 'common'
  },
  color: {
    type: String
  }
})

const component = shallowRef(null)

const params = computed(() => ({
  width: props.width ?? props.size,
  height: props.height ?? props.size,
  color: props.color ?? '#121212'
}))

const style = computed(() => ({
  '--app-icon-width': params.value.width,
  '--app-icon-height': params.value.height,
  '--app-icon-color': params.value.color
}))

watch(
  () => props.name,
  () => {
    component.value = defineAsyncComponent(() => {
      return import(`../assets/icons/${props.dir}/${props.name}.svg`)
    })
  },
  {
    immediate: true
  }
)
</script>

<template>
  <Suspense>
    <component v-bind="$attrs" :is="component" :class="$style.icon" :style="style" />

    <template #fallback>
      <div v-bind="$attrs" :class="$style.icon" :style="style"></div>
    </template>
  </Suspense>
</template>

<style lang="scss" module>
.icon {
  fill: var(--app-icon-color);
  width: var(--app-icon-width);
  height: var(--app-icon-height);
}
</style>
