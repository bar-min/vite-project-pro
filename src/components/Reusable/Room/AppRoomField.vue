<script setup>
import { ref, computed } from 'vue'
import AppRoomSettings from '@/components/Reusable/Room/AppRoomSettings.vue'

const roomSettings = ref([
  {
    adults: 1,
    children: [],
    showList: false
  }
])

const showSettings = ref(false)

const rooms = computed(() => roomSettings.value.length)
const adults = computed(() => {
  return roomSettings.value.reduce((acc, item) => {
    return (acc.adults || acc) + item.adults
  })
})
</script>

<template>
  <div class="room-block">
    <div class="room-field" @click.stop="showSettings = true">
      <span class="room-label">{{ rooms }} rooms for </span>
      <span class="guests-label">{{ adults.adults || adults }} guests</span>
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
  width: 100px;
}

.room-label {
  font-size: 12px;
  color: grey;
}

.guests-label {
  font-size: 14px;
}
</style>
