<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Array, Boolean] },
  value: { type: [Boolean, Object] },
  positionLabel: {
    type: String,
    default: 'right'
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
  <label>
    <template v-if="positionLabel === 'right'">
      <slot />
    </template>

    <input class="real-checkbox" type="checkbox" v-model="model" :value="value" />
    <span
      class="custom-checkbox"
      :class="{ 'custom-checkbox-left': positionLabel === 'right' }"
    ></span>

    <template v-if="positionLabel === 'left'">
      <slot />
    </template>
  </label>
</template>

<style lang="scss" scoped>
.real-checkbox {
  width: 0;
  height: 0;
  opacity: 0;
  position: absolute;
  z-index: -1;
}

.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  background: #ffffff;
  border: 2px solid grey;
  border-radius: 4px;
  vertical-align: sub;
  margin-right: 5px;
}

.custom-checkbox-left {
  margin-left: 5px;
}

.custom-checkbox::before {
  content: '';
  display: inline-block;
  width: 13px;
  height: 13px;
  background-image: url('../../../assets/icons/common/check.svg');
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  margin-top: 1px;
}

.real-checkbox:checked + .custom-checkbox::before {
  transform: translate(-50%, -50%) scale(1);
}
</style>
