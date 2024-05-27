<script setup>
import { ref } from 'vue'
import AppIcon from '../AppIcon.vue'
import AppRadiobutton from '../Fields/AppRadiobutton.vue'
import { useFiltersStore } from '@/stores/filters'

const store = useFiltersStore()
const sorting = store.hotelsPriceSorting

const showModal = ref(false)
</script>

<template>
  <div class="h-p-sorting">
    <div class="h-p-sorting__field" @click="showModal = true">
      <div class="h-p-sorting__angle">
        <AppIcon name="angle" color="grey" />
      </div>

      <p class="h-p-sorting__value">Result View: {{ sorting.selected }}</p>
    </div>

    <div v-show="showModal" class="bg-effect" @click="showModal = false"></div>

    <div class="h-p-sorting-modal" v-show="showModal" ref="modal">
      <div class="h-p-sorting-modal__select">
        <div class="h-p-sorting-modal__body">
          <ul class="h-p-sorting-modal__list">
            <li v-for="(item, idx) in sorting.items" :key="idx">
              <AppRadiobutton v-model="sorting.selected" :value="item" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="h-p-sorting-modal__footer">
          <button class="accept-btn" @click="showModal = false">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.h-p-sorting {
  position: relative;
  max-width: 240px;
  flex-grow: 1;

  &__field {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border: 1px solid hsla(0, 0%, 11%, 0.2);
    border-radius: 4px;
    padding: 0 25px 0 10px;
  }

  &__angle {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
  }

  &__value {
    font-size: 18px;
    color: grey;
    padding: 10px 0;
  }
}

.h-p-sorting-modal {
  &__select {
    position: absolute;
    left: 0;
    margin-top: 6px;
    padding: 10px;
    border: 1px solid hsla(0, 0%, 11%, 0.2);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
    width: 180px;
    background: white;
    z-index: 99;
  }

  &__body {
    display: flex;
    gap: 35px;
  }

  &__title {
    display: inline-block;
    font-size: 18px;
    margin-bottom: 6px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;

    .accept-btn {
      font-weight: 500;
      border: 1px solid hsla(0, 0%, 11%, 0.2);
      border-radius: 4px;
      padding: 5px 10px;
      background-color: #ff7715;
      color: white;
    }
  }
}

.bg-effect {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
}
</style>
