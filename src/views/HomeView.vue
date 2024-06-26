<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import AppLoader from '@/components/Reusable/AppLoader.vue'
import AppAutocomplete from '@/components/Reusable/Fields/AppAutocomplete.vue'
import AppContextAutocomplete from '@/components/Reusable/Fields/AppContextAutocomplete.vue'
import AppCurrencySelect from '@/components/Reusable/Fields/AppCurrencySelect.vue'
import AppRoomField from '@/components/Reusable/Room/AppRoomField.vue'
import AppCalendar from '@/components/Reusable/Fields/AppCalendar.vue'
import AppCheckbox from '@/components/Reusable/Fields/AppCheckbox.vue'
import AppRadiobutton from '@/components/Reusable/Fields/AppRadiobutton.vue'
import AppDigitalInput from '@/components/Reusable/Fields/AppDigitalInput.vue'
import AppSwitcher from '@/components/Reusable/Fields/AppSwitcher.vue'
import AppAdvancedSearch from '@/components/Reusable/Fields/AppAdvancedSearch.vue'
import AppHotelsAvailability from '@/components/Reusable/Fields/AppHotelsAvailability.vue'
import HotelCards from '@/components/Reusable/Hotels/HotelCards.vue'
import { searchItemsByHotelId } from '@/common/services/filters.js'
import { useFiltersStore } from '@/stores/filters'

import {
  getRegions,
  getCities,
  getHotels,
  getCategories,
  getMeals,
  getContextItems,
  searchItems
} from '@/common/services/filters.js'

const store = useFiltersStore()
const hotelsPriceSorting = store.hotelsPriceSorting

const loading = ref(false)

const switchToMergedField = ref(false)
const mergedField = ref([])
const mergedFieldList = ref([])

const dates = ref([])
const datesRange = ref([])
const datesValidationTrigger = ref(false)

const rooms = ref([
  {
    adults: 2,
    children: [],
    showList: false
  }
])

const showAvailableResults = ref(false)
const removeStopSaleResults = ref(true)

const quotaTypes = computed(() => {
  const available = showAvailableResults.value
  const stops = removeStopSaleResults.value

  if (available) {
    return [1]
  }

  if (stops) {
    return [0, 1]
  }

  return []
})

const budget = ref('Net')
const priceFrom = ref(1)
const priceTo = ref(100000)

const regions = ref([])
const selectedRegions = ref([])
const selectedRegionsKeys = ref([])

const cities = ref([])
const selectedCities = ref([])
const selectedCitiesKeys = ref([])

const hotels = ref([])
const hotelsTerm = ref('')
const hotelsPaging = ref({
  number: 1,
  size: 100
})
const selectedHotels = ref([])
const selectedHotelsKeys = ref([])

const categories = ref([])
const selectedCategories = ref([])
const selectedCategoriesKeys = ref([])

const meals = ref([])
const selectedMeals = ref([])
const selectedMealsKeys = ref([])

const payload = ref({
  regions: selectedRegionsKeys,
  cities: selectedCitiesKeys,
  hotels: selectedHotelsKeys,
  categories: selectedCategoriesKeys,
  meals: selectedMealsKeys
})

const searchedPaging = ref(null)
const searchedItems = ref([])

// Validation dates field
const isValidDates = computed(() => {
  if (!datesValidationTrigger.value) return true

  const isFilledDates = dates.value?.filter((el) => el)
  return isFilledDates?.length === 2
})

const searchPayload = computed(() => {
  const modifiedDates = dates.value.filter((el) => el).map((el) => el.toISOString().split('T')[0])
  const [dateFrom, dateTo] = modifiedDates

  const guestsGroups = rooms.value.map((el) => {
    const children_ages = el.children.map((item) => parseInt(item))
    return {
      adults: el.adults,
      children_ages
    }
  })

  return {
    dateFrom,
    dateTo,
    guestsGroups,
    quotaTypes: quotaTypes.value
  }
})

const guestsGroups = computed(() => {
  return rooms.value.map((el) => {
    const children_ages = el.children.map((item) => parseInt(item))
    return {
      adults: el.adults,
      children_ages
    }
  })
})

const guestsGroupsCounter = computed(() => {
  return guestsGroups.value.reduce((acc, el, idx) => {
    const key = el.children_ages.length
      ? `+${el.adults}-${String(el.children_ages)}`
      : `+${el.adults}`
    acc[key] ??= []
    acc[key].push(idx)
    return acc
  }, {})
})

const sortedSearchItemsByHotels = computed(() => {
  if (!searchedItems.value.length) return
  const hotelsSorting = store.hotelsAndRoomsSorting.selected.Hotels

  if (hotelsSorting === 'Hotel name (Az▼)') {
    return [...searchedItems.value].sort((a, b) => a.hotel_name.localeCompare(b.hotel_name))
  }

  if (hotelsSorting === 'Hotel name (Za▼)') {
    return [...searchedItems.value].sort((a, b) => b.hotel_name.localeCompare(a.hotel_name))
  }

  if (hotelsSorting === 'Price (€▲)') {
    return [...searchedItems.value]
      .map((item) => {
        const price = item.rates.reduce((acc, el) => parseFloat((acc + el.price).toFixed(2)), 0)
        return { ...item, price }
      })
      .sort((a, b) => a.price - b.price)
  }

  if (hotelsSorting === 'Price (€▼)') {
    return [...searchedItems.value]
      .map((item) => {
        const price = item.rates.reduce((acc, el) => parseFloat((acc + el.price).toFixed(2)), 0)
        return { ...item, price }
      })
      .sort((a, b) => b.price - a.price)
  }

  return searchedItems.value
})

const sortedSearchItems = computed(() => {
  const searchedItems = sortedSearchItemsByHotels.value
  if (!searchedItems?.length) return
  const roomsSorting = store.hotelsAndRoomsSorting.selected.Rooms

  if (roomsSorting === 'Category') {
    return [...searchedItems].map((el) => {
      if (!el.allVariants) return { ...el }
      const allVariants = el.allVariants.map((variant) => {
        variant.items.sort((a, b) => a.rooms[0].name.localeCompare(b.rooms[0].name))

        const allVariantsPriceIdx = variant.items.findIndex((item) => {
          return item.id + item.rooms[0].id === variant.allVariantsPrice.id
        })

        const rateId = variant.items[allVariantsPriceIdx].id
        const roomId = variant.items[allVariantsPriceIdx].rooms[0].id

        variant.allVariantsPrice = {
          idx: allVariantsPriceIdx,
          id: rateId + roomId,
          price: variant.items[allVariantsPriceIdx].price,
          currency: variant.items[allVariantsPriceIdx].currency,
          roomId
        }

        return variant
      })

      return { ...el, allVariants }
    })
  }

  if (roomsSorting === 'Meal') {
    return [...searchedItems].map((el) => {
      if (!el.allVariants) return { ...el }
      const allVariants = el.allVariants.map((variant) => {
        variant.items.sort((a, b) => a.meals[0].code.localeCompare(b.meals[0].code))

        const allVariantsPriceIdx = variant.items.findIndex((item) => {
          return item.id + item.rooms[0].id === variant.allVariantsPrice.id
        })

        const rateId = variant.items[allVariantsPriceIdx].id
        const roomId = variant.items[allVariantsPriceIdx].rooms[0].id

        variant.allVariantsPrice = {
          idx: allVariantsPriceIdx,
          id: rateId + roomId,
          price: variant.items[allVariantsPriceIdx].price,
          currency: variant.items[allVariantsPriceIdx].currency,
          roomId
        }

        return variant
      })

      return { ...el, allVariants }
    })
  }

  if (roomsSorting === 'Price') {
    return [...searchedItems].map((el) => {
      if (!el.allVariants) return { ...el }
      const allVariants = el.allVariants.map((variant) => {
        variant.items.sort((a, b) => a.price - b.price)

        const allVariantsPriceIdx = variant.items.findIndex((item) => {
          return item.id + item.rooms[0].id === variant.allVariantsPrice.id
        })

        const rateId = variant.items[allVariantsPriceIdx].id
        const roomId = variant.items[allVariantsPriceIdx].rooms[0].id

        variant.allVariantsPrice = {
          idx: allVariantsPriceIdx,
          id: rateId + roomId,
          price: variant.items[allVariantsPriceIdx].price,
          currency: variant.items[allVariantsPriceIdx].currency,
          roomId
        }

        return variant
      })

      return { ...el, allVariants }
    })
  }

  return searchedItems
})

onMounted(async () => {
  regions.value = await getRegions()
  cities.value = await getCities()
  const { hotels: hotelsData, dates: datesData } = await getHotels({ paging: hotelsPaging.value })
  hotels.value = hotelsData
  datesRange.value = datesData
  categories.value = await getCategories()
  meals.value = await getMeals()
})

// Helpers
function clearHotelPaging() {
  const originPaging = {
    number: 1,
    size: 100
  }

  hotelsPaging.value = { ...originPaging }
}

function checkDates() {
  const isDateIncluded = dates.value.every((el) => {
    return (
      new Date(el) > new Date(datesRange.value.from) && new Date(el) < new Date(datesRange.value.to)
    )
  })

  if (!isDateIncluded) {
    dates.value = []
  }
}

function isArraysEqual(firstArray, secondArray) {
  return JSON.stringify(firstArray) === JSON.stringify(secondArray)
}

// Setters
async function setCities() {
  cities.value = await getCities(payload.value)
  selectedCities.value = selectedCities.value.filter((el) => {
    return cities.value.some((item) => item.key === el.key)
  })
  selectedCitiesKeys.value = selectedCities.value.map((el) => el.key)
}

async function setHotels() {
  const { hotels: hotelsData, dates: datesData } = await getHotels({
    ...payload.value,
    paging: hotelsPaging.value
  })
  hotels.value = hotelsData
  datesRange.value = datesData
  selectedHotels.value = selectedHotels.value.filter((el) => {
    return hotels.value.some((item) => item.key === el.key)
  })
  checkDates()
}

async function setCategories() {
  categories.value = await getCategories(payload.value)
  selectedCategories.value = selectedCategories.value.filter((el) => {
    return categories.value.some((item) => item.key === el.key)
  })
  selectedCategoriesKeys.value = selectedCategories.value.map((el) => el.key)
}

async function setMeals() {
  meals.value = await getMeals(payload.value)
  selectedMeals.value = selectedMeals.value.filter((el) => {
    return meals.value.some((item) => item.key === el.key)
  })
  selectedMealsKeys.value = selectedMeals.value.map((el) => el.key)
}

// Regions
async function selectRegions(value) {
  if (isArraysEqual(selectedRegions.value, value)) return

  selectedRegions.value = value
  selectedRegionsKeys.value = value.map((el) => el.key)

  clearHotelPaging()
  await setCities()
  await setHotels()
  await setCategories()
  await setMeals()
}

async function searchRegions(value) {
  regions.value = await getRegions({ ...payload.value, term: value })
}

// Cities
async function selectCities(value) {
  if (isArraysEqual(selectedCities.value, value)) return

  selectedCities.value = value
  selectedCitiesKeys.value = value.map((el) => el.key)

  clearHotelPaging()
  await setHotels()
  await setCategories()
  await setMeals()
}

async function searchCities(value) {
  cities.value = await getCities({ ...payload.value, term: value })
}

// Hotels
function selectHotels(value) {
  selectedHotels.value = value
}

async function searchHotels(value) {
  clearHotelPaging()
  hotelsTerm.value = value
  const { hotels: hotelsData, dates: datesData } = await getHotels({
    ...payload.value,
    paging: hotelsPaging.value,
    term: hotelsTerm.value
  })
  hotels.value = hotelsData
  datesRange.value = datesData
}

async function loadMoreHotels() {
  hotelsPaging.value.number += 1
  const { hotels: hotelsData, dates: datesData } = await getHotels({
    ...payload.value,
    paging: hotelsPaging.value,
    term: hotelsTerm.value
  })
  datesRange.value = datesData
  hotels.value = hotels.value.concat(hotelsData)
}

// Categories
async function selectCategories(value) {
  if (isArraysEqual(selectedCategories.value, value)) return

  selectedCategories.value = value
  selectedCategoriesKeys.value = value = value.map((el) => el.key)

  clearHotelPaging()
  await setHotels()
  await setMeals()
}

async function searchCategories(value) {
  categories.value = await getCategories({ ...payload.value, term: value })
}

// Meals
async function selectMeals(value) {
  if (isArraysEqual(selectedMeals.value, value)) return

  selectedMeals.value = value
  selectedMealsKeys.value = value.map((el) => el.key)

  clearHotelPaging()
  await setHotels()
  await setCategories()
}

async function searchMeals(value) {
  meals.value = await getMeals({ ...payload.value, term: value })
}

// Context
async function selectContextItem(value) {
  if (isArraysEqual(mergedField.value, value)) return

  mergedField.value = value
  const [selectedItem] = value

  if (!selectedItem && !selectedItem?.type) {
    selectedRegionsKeys.value = []
    selectedCitiesKeys.value = []
    selectedHotelsKeys.value = []

    await setHotels()
    await setCategories()
    await setMeals()

    return
  }

  if (selectedItem.type === 'region') {
    selectedCitiesKeys.value = []
    selectedHotelsKeys.value = []
    selectedRegionsKeys.value = [selectedItem.key]
  }

  if (selectedItem.type === 'city') {
    selectedRegionsKeys.value = []
    selectedHotelsKeys.value = []
    selectedCitiesKeys.value = [selectedItem.key]
  }

  if (!selectedItem.type) {
    selectedRegionsKeys.value = []
    selectedCitiesKeys.value = []
    selectedHotelsKeys.value = [selectedItem.key]
  }

  await setHotels()
  await setCategories()
  await setMeals()
}

async function searchContextItems(value) {
  mergedFieldList.value = await getContextItems({ term: value })
}

// Search
async function search() {
  try {
    loading.value = true
    datesValidationTrigger.value = true
    if (!isValidDates.value) return

    searchedItems.value = []
    const modifiedDates = dates.value.map((el) => el.toISOString().split('T')[0])
    const [date_from, date_to] = modifiedDates

    const customPayload = {}

    const clearCustomPayload = () => {
      return Object.keys(customPayload).forEach((key) => delete customPayload[key])
    }

    if (!switchToMergedField.value) {
      clearCustomPayload()
      const regions = selectedRegionsKeys.value
      const cities = selectedCitiesKeys.value
      const hotels = selectedHotels.value.map((el) => el.key)
      const categories = selectedCategoriesKeys.value
      const meals = selectedMealsKeys.value

      if (hotels.length) {
        customPayload.hotels = hotels
        customPayload.meals = meals
      } else if (cities.length) {
        customPayload.cities = cities
        customPayload.categories = categories
        customPayload.meals = meals
      } else if (regions.length) {
        customPayload.regions = regions
        customPayload.categories = categories
        customPayload.meals = meals
      } else {
        customPayload.categories = categories
        customPayload.meals = meals
      }
    } else {
      clearCustomPayload()
      const regions = mergedField.value.filter((el) => el.type === 'region').map((el) => el.key)
      const cities = mergedField.value.filter((el) => el.type === 'city').map((el) => el.key)
      const hotels = mergedField.value.filter((el) => !el.type).map((el) => el.key)
      const categories = selectedCategoriesKeys.value
      const meals = selectedMealsKeys.value

      customPayload.regions = regions
      customPayload.cities = cities
      customPayload.hotels = hotels
      customPayload.categories = categories
      customPayload.meals = meals
    }

    const searchPayload = {
      paging: searchedPaging.value,
      dateFrom: date_from,
      dateTo: date_to,
      guestsGroups: guestsGroups.value,
      residency: 'RU',
      quotaTypes: quotaTypes.value,
      priceFrom: priceFrom.value,
      priceTo: priceTo.value,
      ...customPayload
    }

    const data = await searchItems(searchPayload)
    const modifiedData = {}

    // Обработка ответа
    if (!searchedPaging.value) {
      // На бэке происходит оптимизация комнат, если указать 2 одинаковые комнаты, то в ответе будет всего 1
      // Этот код служит проверкой для такой ситуации

      modifiedData.value = data.map((el) => {
        const modifiedRates = calcRooms(el.rates)
        const rates = Object.values(modifiedRates).flat()
        return { ...el, rates, dates: dates.value }
      })
    } else {
      // Группировка по вариантам
      modifiedData.value = data.map((el) => {
        const variants = el.rates.reduce((acc, el) => {
          const group = el.guestGroup
          const room = group.children_ages.length
            ? `+${group.adults}-${String(group.children_ages)}`
            : `+${group.adults}`
          acc[room] ??= {}
          acc[room].guestGroup = el.guestGroup
          acc[room].items ??= []
          acc[room].items.push(el)
          acc[room].allVariantsPrice = {
            idx: 0,
            id: acc[room].items[0].id + acc[room].items[0].rooms[0].id,
            price: acc[room].items[0].price,
            currency: acc[room].items[0].currency,
            roomId: acc[room].items[0].rooms[0].id
          }

          return acc
        }, {})

        const allVariants = Object.values(variants).flat()
        return { ...el, allVariants, showAllVariants: true }
      })

      // Проверка на оптимизацию комнат
      modifiedData.value = modifiedData.value.map((el) => {
        const variants = calcRooms(el.allVariants)
        const allVariants = Object.values(variants).flat()
        return { ...el, allVariants, dates: dates.value }
      })
    }

    searchedItems.value = modifiedData.value
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function calcRooms(data) {
  return data.reduce((acc, item) => {
    const group = item.guestGroup
    const key = group.children_ages.length
      ? `+${group.adults}-${String(group.children_ages)}`
      : `+${group.adults}`
    const counter = guestsGroupsCounter.value[key]
    acc[key] ??= []

    for (let num in counter) {
      acc[key].push({ ...item })
    }

    return acc
  }, {})
}

async function clearFilters() {
  mergedField.value = []
  selectedRegions.value = []
  selectedRegionsKeys.value = []
  selectedCities.value = []
  selectedCitiesKeys.value = []
  selectedHotels.value = []
  selectedHotelsKeys.value = []
  selectedCategories.value = []
  selectedCategoriesKeys.value = []
  selectedMeals.value = []
  selectedMealsKeys.value = []
  dates.value = []
  datesValidationTrigger.value = false
  rooms.value = [
    {
      adults: 2,
      children: [],
      showList: false
    }
  ]
  priceFrom.value = 1
  priceTo.value = 100000

  clearHotelPaging()
  await setCities()
  await setHotels()
  await setCategories()
  await setMeals()
}

async function loadMoreVariants({ hotel_id }) {
  try {
    loading.value = true
    const idx = searchedItems.value.findIndex((el) => el.hotel_id === hotel_id)
    const data = await searchItemsByHotelId(hotel_id, searchPayload.value)

    // Группировка комнат
    const modifiedData = data.reduce((acc, el) => {
      const group = el.guestGroup
      const room = group.children_ages.length
        ? `+${group.adults}-${String(group.children_ages)}`
        : `+${group.adults}`
      acc[room] ??= {}
      acc[room].guestGroup = el.guestGroup
      acc[room].items ??= []
      acc[room].items.push(el)
      acc[room].allVariantsPrice = {
        idx: 0,
        id: acc[room].items[0].id + acc[room].items[0].rooms[0].id,
        price: acc[room].items[0].price,
        currency: acc[room].items[0].currency,
        roomId: acc[room].items[0].rooms[0].id
      }
      return acc
    }, {})

    // Проверка на оптимизацию комнат
    const result = calcRooms(Object.values(modifiedData))
    const modifiedResult = Object.values(result).flat()

    searchedItems.value[idx].allVariants = modifiedResult

    if (!searchedPaging.value) {
      searchedItems.value.forEach((el, elIdx) => {
        elIdx === idx ? (el.showAllVariants = true) : (el.showAllVariants = false)
      })
    }

    searchedItems.value[idx].clickedMoreVariants = true
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

watch(
  () => showAvailableResults.value,
  (value) => {
    if (value) {
      removeStopSaleResults.value = false
    }
  }
)

watch(
  () => removeStopSaleResults.value,
  (value) => {
    if (value) {
      showAvailableResults.value = false
    }
  }
)

watch(
  () => switchToMergedField.value,
  async (value) => {
    await clearFilters()

    if (value) {
      mergedFieldList.value = await getContextItems()
    }
  }
)

watch(
  () => hotelsPriceSorting,
  async (value) => {
    const num = parseInt(value.selected)

    if (isNaN(num)) {
      searchedPaging.value = null
      await search()
    } else {
      searchedPaging.value = { size: num }
      await search()
    }
  },
  { deep: true }
)
</script>

<template>
  <main>
    <AppLoader v-show="loading" />
    <div class="home-wrapper">
      <div class="home-container">
        <div class="first-filters">
          <template v-if="!switchToMergedField">
            <div class="region-filter">
              <AppSwitcher v-model="switchToMergedField" />
              <AppAutocomplete
                v-model="selectedRegions"
                class="region-filter__field"
                placeholder="Region (all)"
                :list="regions"
                item-label="name"
                @search="searchRegions"
                @done="selectRegions"
              />
            </div>

            <AppAutocomplete
              v-model="selectedCities"
              class="city-filter"
              placeholder="City (all)"
              :list="cities"
              item-label="name"
              @search="searchCities"
              @done="selectCities"
            />

            <AppAutocomplete
              v-model="selectedHotels"
              class="hotel-filter"
              placeholder="Hotel (all)"
              :list="hotels"
              item-label="fullName"
              open-window-width="400px"
              @search="searchHotels"
              @done="selectHotels"
              @load-more="loadMoreHotels"
            />
          </template>

          <template v-else>
            <div class="merged-filter">
              <AppSwitcher v-model="switchToMergedField" />
              <AppContextAutocomplete
                v-model="mergedField"
                class="merged-filter__field"
                placeholder="Where are you going?"
                item-label="name"
                :list="mergedFieldList"
                :multiple="false"
                @search="searchContextItems"
                @done="selectContextItem"
              />
            </div>
          </template>

          <AppAutocomplete
            v-model="selectedCategories"
            class="category-filter-mobile"
            placeholder="Category (all)"
            :list="categories"
            :input-overflow-counter="6"
            item-label="name"
            @search="searchCategories"
            @done="selectCategories"
          />

          <AppAutocomplete
            v-model="selectedMeals"
            class="meal-filter-mobile"
            placeholder="Meal (all)"
            :list="meals"
            item-label="name"
            @search="searchMeals"
            @done="selectMeals"
          />

          <AppCalendar
            v-model="dates"
            :dates-range="datesRange"
            :isValid="isValidDates"
            class="datepicker-filter"
          />

          <AppRoomField v-model="rooms" class="room-filter-desktop" />
        </div>

        <div class="second-filters">
          <div class="checkboxes-filter">
            <AppCheckbox v-model="showAvailableResults">Show available results only</AppCheckbox>
            <AppCheckbox v-model="removeStopSaleResults">Remove stop sale results</AppCheckbox>
          </div>

          <AppAutocomplete
            v-model="selectedCategories"
            class="category-filter-desktop"
            placeholder="Category (all)"
            :list="categories"
            item-label="name"
            :input-overflow-counter="6"
            @search="searchCategories"
            @done="selectCategories"
          />

          <AppAutocomplete
            v-model="selectedMeals"
            class="meal-filter-desktop"
            placeholder="Meal (all)"
            :list="meals"
            item-label="name"
            @search="searchMeals"
            @done="selectMeals"
          />

          <div class="budget-filter">
            <div class="budget-filter__wrapper">
              <span class="budget-filter__title">
                Total Budget <br />
                Hotel Price
              </span>
              <div class="budget-filter__radiobuttons">
                <AppRadiobutton v-model="budget" value="Net">Net</AppRadiobutton>
                <AppRadiobutton v-model="budget" value="Sell">Sell</AppRadiobutton>
              </div>
            </div>

            <div class="price-filter">
              <AppDigitalInput v-model="priceFrom" :max="priceTo" class="price-filter__from" />
              <AppDigitalInput v-model="priceTo" class="price-filter__to" />
              <AppCurrencySelect />
            </div>
          </div>
        </div>

        <div class="tertiary-filters">
          <AppAdvancedSearch class="advanced-search-filter" />
          <AppHotelsAvailability class="hotels-availability-filter" />

          <div class="search-button-wrapper">
            <button class="clear-button" @click="clearFilters">Clear all</button>
            <button class="search-button" @click="search()">Search</button>
          </div>
        </div>
      </div>

      <HotelCards
        :items="sortedSearchItems"
        :payload="searchPayload"
        :guests-groups-counter="guestsGroupsCounter"
        :dates="dates"
        @load-more-variants="loadMoreVariants"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.home-wrapper {
  max-width: 1190px;
  margin: 50px auto;
  padding: 0 20px;
}

.home-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.first-filters {
  display: flex;
  gap: 12px;

  & > div {
    flex-shrink: 0;
  }

  @media (max-width: 1170px) {
    flex-direction: column;
  }
}

.second-filters {
  display: flex;
  gap: 12px;

  & > div {
    flex-shrink: 0;
  }

  @media (max-width: 1170px) {
    flex-wrap: wrap;
  }
}

.tertiary-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.datepicker-filter {
  @media (max-width: 1170px) {
    max-width: none;
  }
}

.merged-filter {
  display: flex;
  flex-grow: 1;
  gap: 12px;

  &__field {
    flex-grow: 1;
  }
}

.region-filter {
  display: flex;
  gap: 12px;
  flex-basis: 221px;

  &__field {
    @media (max-width: 1170px) {
      flex-grow: 1;
    }
  }

  @media (max-width: 1170px) {
    flex-basis: auto;
  }
}

.checkboxes-filter {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-basis: 221px;
  white-space: nowrap;
}

.budget-filter {
  display: flex;
  gap: 12px;
  flex-basis: 440px;

  @media (max-width: 1170px) {
    flex-basis: 370px;
    max-width: 370px;
  }

  @media (max-width: 415px) {
    flex-basis: 290px;
    flex-wrap: wrap;
  }

  &__wrapper {
    display: flex;
    gap: 12px;
    margin: 0 20px;
    flex-shrink: 0;

    @media (max-width: 1170px) {
      margin: 0;
    }

    @media (max-width: 415px) {
      flex-shrink: 1;
      flex-basis: 300px;
    }
  }

  &__title {
    font-weight: 600;
  }

  &__radiobuttons {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
}

.meal-filter-desktop,
.hotel-filter {
  flex-grow: 1;
}

.category-filter-desktop,
.meal-filter-desktop {
  @media (max-width: 1170px) {
    display: none;
  }
}

.category-filter-mobile,
.meal-filter-mobile,
.room-filter-mobile {
  display: none;

  @media (max-width: 1170px) {
    display: block;
  }
}

.price-filter {
  display: flex;
  gap: 8px;

  &__from {
    flex-basis: 80px;
  }

  &__to {
    flex-basis: 105px;
  }
}

.search-button {
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 8px 55px;
  max-height: 40px;
  width: 100%;
  font-weight: 600;
  background-color: #ff7715;
  color: white;
}

.clear-button {
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 5px 10px;
  background-color: hsla(0, 0%, 11%, 0.4);
  color: white;
  min-width: 100px;
}

.search-button-wrapper {
  display: flex;
  margin-left: auto;
  gap: 12px;
}

.advanced-search-filter,
.hotels-availability-filter,
.search-button-wrapper {
  @media (max-width: 556px) {
    width: 100%;
  }
}
</style>
