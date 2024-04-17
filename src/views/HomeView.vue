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
            class="region-autocomplete"
            placeholder="Region (all)"
            :list="['Red', 'Orange', 'Green', 'Yellow']"
          />
          <AppAutocomplete
            class="city-autocomplete"
            placeholder="City (all)"
            :list="['Red', 'Orange', 'Green', 'Yellow']"
          />
          <AppAutocomplete
            class="hotel-autocomplete"
            placeholder="Hotel (all)"
            :list="['Red', 'Orange', 'Green', 'Yellow']"
          />
          <AppCalendar />
          <AppRoomField />
        </div>

        <div class="second-filters">
          <div class="second-filters-checkboxes">
            <AppCheckbox>Show available results only</AppCheckbox>
            <AppCheckbox>Remove stop sale results</AppCheckbox>
          </div>

          <AppAutocomplete placeholder="Category" :list="['Red', 'Orange', 'Green', 'Yellow']" />
          <AppAutocomplete placeholder="Meal" :list="['Red', 'Orange', 'Green', 'Yellow']" />

          <div class="second-filters-budget">
            <span class="second-filters-budget__title"> Budget Hotel Price </span>
            <div class="second-filters-radiobuttons">
              <AppRadiobutton v-model="budget" value="Net">Net</AppRadiobutton>
              <AppRadiobutton v-model="budget" value="Sell">Sell</AppRadiobutton>
            </div>
          </div>

          <div class="second-filters-price">
            <AppDigitalInput v-model="priceFrom" class="price-from-input" />
            <AppDigitalInput v-model="priceTo" class="price-to-input" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.home-wrapper {
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 25px;
}

.home-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.first-filters,
.second-filters {
  display: flex;
  gap: 12px;

  & > div {
    flex-shrink: 0;
  }
}

.region-autocomplete {
  flex-basis: 220px;
}

.second-filters-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.second-filters-budget {
  display: flex;
  gap: 12px;
  margin: 0 20px;

  &__title {
    font-weight: 600;
  }
}

.second-filters-radiobuttons {
  display: flex;
  flex-direction: column;
}

.second-filters-price {
  display: flex;
  gap: 5px;
}

.price-from-input {
  flex-basis: 65px;
}

.price-to-input {
  flex-basis: 85px;
}
</style>
