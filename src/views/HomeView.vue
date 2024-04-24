<script setup>
import { ref, watch, onMounted } from 'vue'
import AppAutocomplete from '@/components/Reusable/Fields/AppAutocomplete.vue'
import AppContextAutocomplete from '@/components/Reusable/Fields/AppContextAutocomplete.vue'
import AppRoomField from '@/components/Reusable/Room/AppRoomField.vue'
import AppCalendar from '@/components/Reusable/Fields/AppCalendar.vue'
import AppCheckbox from '@/components/Reusable/Fields/AppCheckbox.vue'
import AppRadiobutton from '@/components/Reusable/Fields/AppRadiobutton.vue'
import AppDigitalInput from '@/components/Reusable/Fields/AppDigitalInput.vue'
import AppSwitcher from '@/components/Reusable/Fields/AppSwitcher.vue'
import AppAdvancedSearch from '@/components/Reusable/Fields/AppAdvancedSearch.vue'
import AppHotelsAvailability from '@/components/Reusable/Fields/AppHotelsAvailability.vue'
import {
  getRegions,
  getCities,
  getHotels,
  getCategories,
  getMeals,
  getContextItems
} from '@/common/services/filters.js'

const switchToMergedField = ref(false)
const mergedField = ref([])
const mergedFieldKeys = ref([])
const mergedFieldList = ref([])

const dates = ref([])
const datesRange = ref([])
const rooms = ref([])

const showAvailableResults = ref(true)
const removeStopSaleResults = ref(false)

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

onMounted(async () => {
  regions.value = await getRegions()
  cities.value = await getCities()
  const { hotels: hotelsData, dates: datesData } = await getHotels({ paging: hotelsPaging.value })
  hotels.value = hotelsData
  datesRange.value = datesData
  categories.value = await getCategories()
  meals.value = await getMeals()
  mergedFieldList.value = await getContextItems()
})

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
  selectedRegions.value = value
  selectedRegionsKeys.value = value.map((el) => el.key)

  clearHotelPaging()
  await setCities()
  await setHotels()
  await setCategories()
  await setMeals()
  checkDates()
}

async function searchRegions(value) {
  regions.value = await getRegions({ ...payload.value, term: value })
}

// Cities
async function selectCities(value) {
  selectedCities.value = value
  selectedCitiesKeys.value = value.map((el) => el.key)

  clearHotelPaging()
  await setHotels()
  await setCategories()
  await setMeals()
  checkDates()
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
  const page = hotelsPaging.value.size / 10
  hotelsPaging.value.number += page
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
  selectedCategories.value = value
  selectedCategoriesKeys.value = value = value.map((el) => el.key)

  clearHotelPaging()
  await setHotels()
  await setMeals()
  checkDates()
}

async function searchCategories(value) {
  categories.value = await getCategories({ ...payload.value, term: value })
}

// Meals
async function selectMeals(value) {
  selectedMeals.value = value
  selectedMealsKeys.value = value.map((el) => el.key)

  clearHotelPaging()
  await setHotels()
  await setCategories()
  checkDates()
}

async function searchMeals(value) {
  meals.value = await getMeals({ ...payload.value, term: value })
}

async function selectContextItem(value) {
  mergedField.value = value
  mergedFieldKeys.value = value.map((el) => el.key)

  const [selectedItem] = value

  if (!selectedItem) return

  if (selectedItem.type === 'region') {
    selectedCitiesKeys.value = []
    selectedHotelsKeys.value = []
    selectedRegionsKeys.value = value.map((el) => el.key)
  }

  if (selectedItem.type === 'city') {
    selectedRegionsKeys.value = []
    selectedHotelsKeys.value = []
    selectedCitiesKeys.value = value.map((el) => el.key)
  }

  if (!selectedItem.type) {
    selectedRegionsKeys.value = []
    selectedCitiesKeys.value = []
    selectedHotelsKeys.value = value.map((el) => el.key)
  }

  await setHotels()
  await setCategories()
  await setMeals()
  checkDates()
}

async function searchContextItems(value) {
  mergedFieldList.value = await getContextItems({ term: value })
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
    selectedRegionsKeys.value = []
    selectedCitiesKeys.value = []
    selectedHotelsKeys.value = []
    selectedCategoriesKeys.value = []
    selectedMealsKeys.value = []

    if (value) {
      mergedField.value = []
    }

    if (!value) {
      selectedHotels.value = []
      selectedCategories.value = []
      selectedMeals.value = []
      await setHotels()
      await setCategories()
      await setMeals()
    }
  }
)
</script>

<template>
  <main>
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
                :show-select-only="false"
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

          <AppCalendar v-model="dates" :dates-range="datesRange" class="datepicker-filter" />

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
              <span class="budget-filter__title"> Budget Hotel Price </span>
              <div class="budget-filter__radiobuttons">
                <AppRadiobutton v-model="budget" value="Net">Net</AppRadiobutton>
                <AppRadiobutton v-model="budget" value="Sell">Sell</AppRadiobutton>
              </div>
            </div>

            <div class="price-filter">
              <AppDigitalInput v-model="priceFrom" class="price-filter__from" />
              <AppDigitalInput v-model="priceTo" class="price-filter__to" />
            </div>
          </div>
        </div>

        <div class="tertiary-filters">
          <AppAdvancedSearch class="advanced-search-filter" />
          <AppHotelsAvailability class="hotels-availability-filter" />
          <div class="search-button-wrapper">
            <button class="search-button">Search</button>
          </div>
        </div>
      </div>
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
}

.budget-filter {
  display: flex;
  gap: 12px;
  flex-basis: 430px;

  @media (max-width: 1170px) {
    flex-basis: 370px;
    max-width: 370px;
  }

  @media (max-width: 415px) {
    flex-basis: 290px;
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
  gap: 5px;

  &__from {
    flex-basis: 65px;
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

.search-button-wrapper {
  display: flex;
  margin-left: auto;
}

.advanced-search-filter,
.hotels-availability-filter,
.search-button-wrapper {
  @media (max-width: 556px) {
    width: 100%;
  }
}
</style>
