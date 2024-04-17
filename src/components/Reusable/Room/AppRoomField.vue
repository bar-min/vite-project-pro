<script setup>
import { ref, computed, watch } from 'vue'
import AppRoomSettings from '@/components/Reusable/Room/AppRoomSettings.vue'

const emit = defineEmits(['update:modelValue'])

const roomSettings = ref([
  {
    adults: 2,
    children: [],
    showList: false
  }
])

const showSettings = ref(false)

const pr = new Intl.PluralRules('ru')
const roomSuffixes = { one: 'room', few: 'rooms', many: 'rooms' }
const adultSuffixes = { one: 'adult', few: 'adults', many: 'adults' }
const childSuffixes = { one: 'child', few: 'children', many: 'children' }

const rooms = computed(() => roomSettings.value.length)
const adults = computed(() => {
  return roomSettings.value.reduce((acc, item) => {
    return acc + item.adults
  }, 0)
})
const children = computed(() => {
  const hasChildren = roomSettings.value.some((el) => el.children.length)
  if (!hasChildren) return 0

  return roomSettings.value.reduce((prev, el) => {
    return prev + el.children.length
  }, 0)
})

watch(
  () => roomSettings.value,
  (value) => {
    console.log('value', value)
    emit('update:modelValue', value)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="room-block">
    <div class="room-field" @click.stop="showSettings = true">
      <span class="room-label">{{ rooms }} {{ roomSuffixes[pr.select(rooms)] }} for </span>
      <span class="guests-label">
        {{ adults }} {{ adultSuffixes[pr.select(adults)] }}

        <template v-if="children">
          /
          {{ children }} {{ childSuffixes[pr.select(children)] }}
        </template>
      </span>
    </div>

    <AppRoomSettings
      v-show="showSettings"
      v-model="roomSettings"
      @click-outside="showSettings = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.room-block {
  position: relative;
}

.room-field {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 0 10px;
  width: 150px;
  // min-width: 100px;
  // max-width: 150px;
}

.room-label {
  font-size: 12px;
  color: grey;
}

.guests-label {
  font-size: 14px;
}
</style>
