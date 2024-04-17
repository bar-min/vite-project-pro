<script setup>
import { ref, watch } from 'vue'
import AppNumberInput from '@/components/Reusable/Fields/AppNumberInput.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useClickOutside } from '@/composables/clickOutside'

const props = defineProps({
  modelValue: {
    type: [Array, Object],
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'clickOutside'])

const modal = ref(null)
useClickOutside(modal, () => emit('clickOutside'))

const childAges = ref([
  '1 year',
  '2 years',
  '3 years',
  '4 years',
  '5 years',
  '6 years',
  '7 years',
  '8 years',
  '9 years',
  '10 years',
  '11 years',
  '12 years',
  '13 years',
  '14 years',
  '15 years',
  '16 years',
  '17 years'
])

const rooms = ref(props.modelValue)

function addRoom() {
  rooms.value.push({
    adults: 1,
    children: [],
    showList: false
  })
}

function removeRoom(idx) {
  rooms.value.splice(idx, 1)
}

function onSelectChild(idx, age) {
  const itemIndex = rooms.value[idx].children.findIndex((el) => el === age)
  if (itemIndex === -1) {
    rooms.value[idx].children.push(age)
  } else {
    rooms.value[idx].children.splice(itemIndex, 1)
  }
}

function onRemoveChild(idx, childIdx) {
  rooms.value[idx].children.splice(childIdx, 1)
}

function onBlur(idx) {
  rooms.value[idx].showList = false
}

watch(
  () => rooms.value,
  (value) => {
    emit('update:modelValue', value)
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="room-settings" ref="modal">
    <div class="room-select">
      <div class="room">
        <div class="room-wrapper" v-for="(room, idx) in rooms" :key="idx">
          <div class="room-header">
            <h2 class="room-title">Room {{ idx + 1 }}</h2>
            <span v-show="idx" class="room-remove" @click="removeRoom(idx)">Remove</span>
          </div>

          <div class="room-body">
            <div class="adults">
              <span class="room-subtitle">Adults</span>
              <div class="number-input">
                <AppNumberInput v-model="room.adults" :min="1" controls />
              </div>
            </div>

            <div class="children" :tabindex="0" @blur="onBlur(idx)">
              <span class="room-subtitle">Children</span>

              <div class="children-wrapper">
                <div class="children-list" v-show="room.children.length">
                  <div
                    class="children-item"
                    v-for="(child, childIdx) in room.children"
                    :key="child"
                  >
                    <span>{{ child }}</span>
                    <AppIcon
                      name="cross"
                      size="18px"
                      color="grey"
                      @click="onRemoveChild(idx, childIdx)"
                      style="cursor: pointer"
                    />
                  </div>
                </div>

                <div class="child-input">
                  <div @click="rooms[idx].showList = true">Add a child</div>

                  <ul v-show="rooms[idx].showList" class="child-select">
                    <li
                      v-for="age in childAges"
                      :key="age"
                      class="child-select-item"
                      :class="{ selected: room.children.some((el) => el === age) }"
                      @click="onSelectChild(idx, age)"
                    >
                      {{ age }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="room-footer">
          <div class="room-footer-add" @click="addRoom">Add a room</div>
          <button class="room-footer-done" @click="emit('clickOutside')">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room-select {
  position: absolute;
  margin-top: 6px;
  padding: 10px;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  width: 280px;
}

.room-header {
  display: flex;
  justify-content: space-between;
}

.room-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.room-remove {
  cursor: pointer;
  color: red;
}

.room-subtitle {
  font-size: 12px;
}

.adults {
  flex-shrink: 0;
}

.room-body {
  display: flex;
  gap: 40px;
  padding-bottom: 20px;
}

.child-input {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 3.5px 10px;
  max-width: 130px;
}

.child-select {
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-top: none;
  position: absolute;
  background-color: white;
  top: 30px;
  left: 0;
  z-index: 10;
  width: 100%;
}

.child-select-item {
  cursor: pointer;
  padding: 5px 10px;

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

.children-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3.5px 10px;
  border-radius: 4px;
  background-color: hsla(0, 0%, 11%, 0.2);
}

.children-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.children-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-footer-add {
  cursor: pointer;
  color: #ff7715;
  font-weight: 800;
}

.room-footer-done {
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 5px 10px;
  background-color: #ff7715;
  color: white;
}
</style>
