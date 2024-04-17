<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true }
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

function checkDigit(event) {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}
</script>

<template>
  <div>
    <input class="digital-input" v-model.number="model" @keydown="checkDigit" />
  </div>
</template>

<style lang="scss" scoped>
.digital-input {
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  text-align: center;
}
</style>
