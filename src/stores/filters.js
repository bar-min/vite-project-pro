import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFiltersStore = defineStore('filters', () => {
  const hotelsAndRoomsSorting = ref({
    items: {
      Hotels: ['Hotel name (Az▼)', 'Hotel name (Za▼)', 'Price (€▲)', 'Price (€▼)'],
      Rooms: ['Category', 'Meal', 'Price']
    },
    selected: {
      Hotels: 'Price (€▲)',
      Rooms: 'Category'
    }
  })

  const hotelsPriceSorting = ref({
    items: ['Min prices', '2 prices', '3 prices'],
    selected: 'Min prices'
  })

  return { hotelsAndRoomsSorting, hotelsPriceSorting }
})
