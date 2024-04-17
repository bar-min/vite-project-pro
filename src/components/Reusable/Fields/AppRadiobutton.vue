<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Array, Boolean, String] },
  value: { type: [Boolean, Object, String] },
  positionLabel: {
    type: String,
    default: 'left'
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <label class="label-radio">
    <template v-if="positionLabel === 'right'">
      <slot />
    </template>

    <input class="real-radio" type="radio" v-model="model" :value="value" />
    <span
      class="custom-radio"
      :class="{ 'custom-checkbox-left': positionLabel === 'right' }"
    ></span>

    <template v-if="positionLabel === 'left'">
      <slot />
    </template>
  </label>
</template>

<style lang="scss" scoped>
.label-radio {
  cursor: pointer;
}

.real-radio {
  width: 0;
  height: 0;
  opacity: 0;
  position: absolute;
  z-index: -1;
}

.custom-radio {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  background: #ffffff;
  border: 2px solid grey;
  border-radius: 10px;
  vertical-align: sub;
  margin-right: 5px;
}

.custom-radio-left {
  margin-left: 5px;
}

.custom-radio::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #ff7715;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
}

.real-radio:checked + .custom-radio::before {
  transform: translate(-50%, -50%) scale(1);
}
</style>
