<script setup>
import { ref, computed } from 'vue'
import AppCheckbox from './AppCheckbox.vue'
import { useClickOutside } from '@/composables/clickOutside'
import AppIcon from '../AppIcon.vue'

const showList = ref(false)

const modal = ref(null)
useClickOutside(modal, () => (showList.value = false))

const filters = ref([
  {
    title: 'VIP',
    value: false
  },
  {
    title: 'Близость к аэропорту',
    value: false
  },
  {
    title: 'Семейный',
    value: false
  },
  {
    title: 'Серфинг',
    value: false
  },
  {
    title: 'Большой остров',
    value: false
  },
  {
    title: 'Подводный ресторан',
    value: false
  },
  {
    title: 'Домашний риф',
    value: false
  }
])

const selectedFilters = computed(() => filters.value.filter((el) => el.value))
</script>

<template>
  <div class="advanced-search-wrapper">
    <div class="advanced-search">
      <button class="advanced-search-btn" @click.stop="showList = true">Advanced search</button>
      <div class="advanced-search-badge" v-show="selectedFilters.length">
        {{ selectedFilters.length }}
      </div>

      <div class="advanced-search-angle" @click.stop="showList = true">
        <AppIcon name="angle" color="grey" />
      </div>
    </div>

    <div class="advanced-filters" :class="{ active: showList }" ref="modal">
      <div class="advanced-filters-close" @click="showList = false">
        <AppIcon name="cross" size="30px" color="grey" />
      </div>

      <ul class="advanced-filters__list">
        <li class="advanced-filters__item" v-for="(item, idx) in filters" :key="idx">
          <AppCheckbox v-model="item.value"> {{ item.title }}</AppCheckbox>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.advanced-search-angle {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 5px;
  height: 20px;
  width: 20px;
  transform: translateY(-50%) rotate(270deg);
}
</style>

<style lang="scss" scoped>
.advanced-search {
  position: relative;
}

.advanced-search-btn {
  cursor: pointer;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 10px 25px 10px 10px;
  max-height: 40px;
  width: 100%;
}

.advanced-search-badge {
  position: absolute;
  display: inline-flex;
  text-align: center;
  align-items: center;
  padding: 1px 4px;
  font-weight: 700;
  box-shadow: 0 0 0 2px #fff;
  top: -7px;
  left: -7px;
  background: #ff7715;
  border-radius: 50px;
  color: #fff;
  font-size: 13px;
  height: 15px;
  justify-content: center;
  line-height: 13px;
  min-width: 16px;
}

.advanced-filters {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 300px;
  padding: 30px;
  background-color: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
  transform: translateX(-100%);
  z-index: 100;
  transition: all 0.5s;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &.active {
    transform: translateX(0);
  }
}

.advanced-filters-close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
