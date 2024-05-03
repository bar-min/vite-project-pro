<script setup>
import { ref } from 'vue'

const showList = ref(false)
const currency = ref(['€', 'лв'])
const selectedValue = ref('€')
const selectedItems = ref([])

function onSelect(item) {
  selectedItems.value = []
  selectedItems.value.push(item)
  selectedValue.value = item
  showList.value = false
}

function onBlur() {
  showList.value = false
}
</script>

<template>
  <div class="currency-select-wrapper" :tabindex="0" @blur="onBlur">
    <div class="currency-select-title" @click="showList = true">{{ selectedValue }}</div>

    <ul class="currency-select" v-show="showList">
      <li
        class="currency-select-item"
        :class="{ selected: selectedItems.some((el) => el === item) }"
        v-for="(item, idx) in currency"
        :key="idx"
        @click="onSelect(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.currency-select-wrapper {
  position: relative;
  cursor: pointer;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  text-align: center;
  width: 42px;
}

.currency-select {
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  background-color: white;
  z-index: 10;
  width: 100%;
}

.currency-select-title {
  padding: 10px;
}

.currency-select-item {
  cursor: pointer;
  padding: 5px 0;

  &:not(:last-child) {
    margin-bottom: 1px;
  }

  &:hover {
    background-color: #f4f4f4;
  }

  &.selected {
    background-color: #c8c8c8;
  }
}
</style>
