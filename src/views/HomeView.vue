<script setup>
import { ref } from 'vue'
import AppAutocomplete from '@/components/Reusable/Fields/AppAutocomplete.vue'
import AppRoomField from '@/components/Reusable/Room/AppRoomField.vue'
import AppCalendar from '@/components/Reusable/Fields/AppCalendar.vue'
import AppCheckbox from '@/components/Reusable/Fields/AppCheckbox.vue'
import AppRadiobutton from '@/components/Reusable/Fields/AppRadiobutton.vue'
import AppDigitalInput from '@/components/Reusable/Fields/AppDigitalInput.vue'

const budget = ref('Net')
const priceFrom = ref(1)
const priceTo = ref(100000)
</script>

<template>
  <main>
    <div class="home-wrapper">
      <div class="home-container">
        <div class="first-filters">
          <AppAutocomplete
            class="region-filter"
            placeholder="Region (all)"
            :list="['Red', 'Orange', 'Green', 'Yellow']"
          />
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

          <AppCalendar class="datepicker-filter" />

          <!-- Only desktop -->
          <AppRoomField class="room-filter-desktop" />
        </div>

        <div class="second-filters">
          <!-- Only mobile -->
          <AppRoomField class="room-filter-mobile" />

          <div class="checkboxes-filter">
            <AppCheckbox>Show available results only</AppCheckbox>
            <AppCheckbox>Remove stop sale results</AppCheckbox>
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

.region-filter {
  flex-basis: 220px;

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
  margin: 0 20px;

  &__title {
    font-weight: 600;
  }

  &__radiobuttons {
    display: flex;
    flex-direction: column;
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
  flex-basis: 160px;
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
  margin: 0;

  @media (max-width: 1140px) {
    display: block;
  }
}
</style>
