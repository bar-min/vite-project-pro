<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true
  },
  max: {
    type: Number
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    if (value > props.max) {
      emit('update:modelValue', props.max)
      return
    }
    emit('update:modelValue', value)
  }
})

// function checkDigit(event) {
//   if (event.key.length === 1 && isNaN(Number(event.key))) {
//     event.preventDefault()
//   }
// }

function checkValue(e) {
  if (e.target.value.match(/[^0-9]/g)) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '')
  }

  if (props.max) {
    e.target.value = e.target.value > props.max ? props.max : e.target.value
  }
}
</script>

<template>
  <div>
    <input class="digital-input" inputmode="numeric" v-model.number="model" @input="checkValue" />
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
