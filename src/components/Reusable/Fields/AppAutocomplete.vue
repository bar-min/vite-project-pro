<script setup>
import { ref, computed, watch } from 'vue'
import AppCheckbox from '@/components/Reusable/Fields/AppCheckbox.vue'
import AppIcon from '../AppIcon.vue'

const props = defineProps({
  list: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Enter...'
  },
  itemLabel: {
    type: [String, Number],
    required: false,
    default: null
  },
  itemValue: {
    type: [String, Number],
    required: false,
    default: null
  },
  showSelectOnly: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: true
  }
})

const inputValue = ref('')
const focusInputValue = ref('')

const selectedItems = ref([])
const selectedTruthyItems = ref([])

const focus = ref(false)
const onlySelected = ref(false)

const filteredList = computed(() => {
  if (onlySelected.value) {
    return props.list.filter((el) => {
      return selectedItems.value.find((item) => item === el)
    })
  }

  return props.list.filter((el) => {
    return el.toLowerCase().includes(focusInputValue.value.toLowerCase())
  })
})

function onSelect(item) {
  const itemIndex = selectedItems.value.findIndex((el) => el === item)

  if (!props.multiple) {
    if (itemIndex === -1) {
      if (selectedItems.value.length) return
      selectedItems.value.push(item)
    } else {
      selectedItems.value.splice(itemIndex, 1)
    }
  }

  if (props.multiple) {
    itemIndex === -1 ? selectedItems.value.push(item) : selectedItems.value.splice(itemIndex, 1)
  }
}

function showList() {
  selectedItems.value = [...selectedTruthyItems.value]
  focus.value = true
}

function hideList() {
  selectedItems.value = []
  focus.value = false
}

function acceptList() {
  selectedTruthyItems.value = [...selectedItems.value]
  focus.value = false
}

function clearList() {
  selectedItems.value = []
}

watch(
  () => selectedTruthyItems.value,
  (value) => {
    inputValue.value = value.join(', ')
  }
)
</script>

<template>
  <div class="autocomplete">
    <input
      v-model="inputValue"
      class="autocomplete-input"
      :placeholder="placeholder"
      @focus="showList"
    />

    <AppIcon class="autocomplete-angle" name="angle" color="grey" @click="showList" />

    <div v-show="focus" class="bg-effect" @click="hideList"></div>

    <div v-show="focus" class="focus-wrapper">
      <input
        v-model="focusInputValue"
        class="autocomplete-input"
        :placeholder="placeholder"
        :disabled="onlySelected"
      />

      <div class="only-selected" v-if="showSelectOnly">
        <AppCheckbox v-model="onlySelected" position-label="right">Only selected</AppCheckbox>
      </div>

      <ul class="focus-list">
        <li
          class="list-item"
          :class="{ selected: selectedItems.some((el) => el === item) }"
          v-for="(item, idx) in filteredList"
          :key="idx"
          @click="onSelect(item)"
          :title="item"
        >
          {{ item }}
        </li>
      </ul>

      <div class="accept-wrapper">
        <button class="clear-btn" @click="clearList">Clear</button>
        <button class="accept-btn" @click="acceptList">Done</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.autocomplete-angle {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
}
</style>

<style lang="scss" scoped>
.autocomplete {
  position: relative;
}

.autocomplete-input {
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 10px 25px 10px 10px;
  width: 100%;
}

.bg-effect {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
}

.focus-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
  z-index: 100;
  background-color: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  width: 100%;
}

.list-item {
  cursor: pointer;
  padding: 3px 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;

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

.accept-wrapper {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid hsla(0, 0%, 11%, 0.2);
}

.clear-btn {
  margin: 6px;
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 5px 10px;
  background-color: hsla(0, 0%, 11%, 0.4);
  color: white;
}
.accept-btn {
  margin: 6px;
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 5px 10px;
  background-color: #ff7715;
  color: white;
}

.only-selected {
  display: flex;
  justify-content: flex-end;
  font-weight: 800;
  padding: 5px 0;
  color: #ff7715;
}
</style>
