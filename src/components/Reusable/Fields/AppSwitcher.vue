<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Array, Boolean] },
  value: { type: [Boolean, Object] },
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
  <label class="switch">
    <input type="checkbox" v-model="model" />
    <span class="slider round"></span>
  </label>
</template>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 40px;
  flex-shrink: 0;
  transform: rotate(180deg);
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ff7715;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #ff7715;
}

input:focus + .slider {
  box-shadow: 0 0 1px #ff7715;
}

input:checked + .slider:before {
  -webkit-transform: translateY(-20px);
  -ms-transform: translateY(-20px);
  transform: translateY(-20px);
}

/* Закругленные ползунки */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
