<script setup>
import { ref, computed, watch } from 'vue'
import AppRoomSettings from '@/components/Reusable/Room/AppRoomSettings.vue'
import AppIcon from '../AppIcon.vue'

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
    emit('update:modelValue', value)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="room-block">
    <div class="room-field" @click.stop="showSettings = true">
      <div class="room-angle">
        <AppIcon name="angle" color="grey" @click="showList" />
      </div>

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
  padding: 0 25px 0 10px;
  width: 150px;

  @media (max-width: 1140px) {
    width: auto;
  }
}

.room-angle {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}

.room-label {
  font-size: 12px;
  color: grey;
}

.guests-label {
  font-size: 14px;
}
</style>
