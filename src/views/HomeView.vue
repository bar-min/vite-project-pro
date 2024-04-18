<script setup>
import { ref } from 'vue'
import AppAutocomplete from '@/components/Reusable/Fields/AppAutocomplete.vue'
import AppRoomField from '@/components/Reusable/Room/AppRoomField.vue'
import AppCalendar from '@/components/Reusable/Fields/AppCalendar.vue'
import AppCheckbox from '@/components/Reusable/Fields/AppCheckbox.vue'
import AppRadiobutton from '@/components/Reusable/Fields/AppRadiobutton.vue'
import AppDigitalInput from '@/components/Reusable/Fields/AppDigitalInput.vue'
import AppSwitcher from '@/components/Reusable/Fields/AppSwitcher.vue'

const switchToMergedField = ref(false)
const dates = ref([])
const rooms = ref([])

const showAvailableResults = ref(true)
const removeStopSaleResults = ref(true)

const budget = ref('Net')
const priceFrom = ref(1)
const priceTo = ref(100000)
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
                class="region-filter__field"
                placeholder="Region (all)"
                :list="['Red', 'Orange', 'Green', 'Yellow']"
              />
            </div>

            <AppAutocomplete
              class="city-filter"
              placeholder="City (all)"
              :list="['Red', 'Orange', 'Green', 'Yellow']"
            />

            <AppAutocomplete
              class="hotel-filter"
              placeholder="Hotel (all)"
              :list="['Red', 'Orange', 'Green', 'Yellow']"
            />
          </template>

          <template v-else>
            <div class="merged-filter">
              <AppSwitcher v-model="switchToMergedField" />
              <AppAutocomplete
                class="merged-filter__field"
                placeholder="Where are you going?"
                :list="['Red', 'Orange', 'Green', 'Yellow']"
              />
            </div>
          </template>

          <!-- Only mobile -->
          <AppAutocomplete
            class="category-filter-mobile"
            placeholder="Category (all)"
            :list="['Red', 'Orange', 'Green', 'Yellow']"
          />

          <!-- Only mobile -->
          <AppAutocomplete
            class="meal-filter-mobile"
            placeholder="Meal (all)"
            :list="['Red', 'Orange', 'Green', 'Yellow']"
          />

          <AppCalendar v-model="dates" class="datepicker-filter" />

          <!-- Only desktop -->
          <AppRoomField v-model="rooms" class="room-filter-desktop" />
        </div>

        <div class="second-filters">
          <!-- Only mobile -->
          <AppRoomField v-model="rooms" class="room-filter-mobile" />

          <div class="checkboxes-filter">
            <AppCheckbox v-model="showAvailableResults">Show available results only</AppCheckbox>
            <AppCheckbox v-model="removeStopSaleResults">Remove stop sale results</AppCheckbox>
          </div>

          <!-- Only desktop -->
          <AppAutocomplete
            class="category-filter-desktop"
            placeholder="Category (all)"
            :list="['Red', 'Orange', 'Green', 'Yellow']"
          />

          <!-- Only desktop -->
          <AppAutocomplete
            class="meal-filter-desktop"
            placeholder="Meal (all)"
            :list="['Red', 'Orange', 'Green', 'Yellow']"
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

          <!-- Only mobile -->
          <button class="search-button-mobile">Search</button>
        </div>

        <!-- Only desktop -->
        <button class="search-button-desktop">Search</button>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.home-wrapper {
  max-width: 1120px;
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

  @media (max-width: 1140px) {
    flex-direction: column;
  }
}

.second-filters {
  display: flex;
  gap: 12px;

  & > div {
    flex-shrink: 0;
  }

  @media (max-width: 1140px) {
    flex-wrap: wrap;
  }
}

.datepicker-filter {
  @media (max-width: 1140px) {
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
    @media (max-width: 1140px) {
      flex-grow: 1;
    }
  }

  @media (max-width: 1140px) {
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
  flex-basis: 412px;

  @media (max-width: 1140px) {
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

    @media (max-width: 1140px) {
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

.category-filter-desktop,
.meal-filter-desktop,
.room-filter-desktop {
  @media (max-width: 1140px) {
    display: none;
  }
}

.category-filter-mobile,
.meal-filter-mobile,
.room-filter-mobile {
  display: none;

  @media (max-width: 1140px) {
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
    flex-basis: 88px;
  }
}

.search-button-desktop,
.search-button-mobile {
  display: flex;
  margin: 0 5px 5px auto;
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 8px 55px;
  max-height: 40px;
  font-weight: 600;
  background-color: #ff7715;
  color: white;
}

.search-button-desktop {
  @media (max-width: 1140px) {
    display: none;
  }
}

.search-button-mobile {
  display: none;

  @media (max-width: 1140px) {
    display: block;
  }
}
</style>
