<script setup>
import AppIcon from '@/components/Reusable/AppIcon.vue'
import { searchItemsByHotelId } from '@/common/services/filters.js'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  payload: {
    type: Object,
    default: () => {}
  }
})

const currencies = {
  EUR: '€',
  ЛВ: 'ЛВ'
}

function calcFullHotelPrice(rates) {
  const currency = rates[0].currency
  const price = rates.reduce((acc, el) => parseFloat((acc + el.price).toFixed(2)), 0)
  return `${price} ${currencies[currency]}`
}

async function loadMoreVariants(id) {
  // const data = await searchItemsByHotelId(id, props.payload)
  // console.log('data', data)
}
</script>

<template>
  <div class="searched-items">
    <div class="searched-items__block" v-for="(item, idx) in items" :key="idx">
      <h3 class="searched-items__name">{{ item.hotel_name }}</h3>

      <div class="searched-items__body">
        <ul class="searched-items__rooms">
          <li
            class="searched-items__room room-item"
            v-for="(room, roomIdx) in item.rates"
            :key="roomIdx"
          >
            <div class="room-item__room">
              <span>Room {{ roomIdx + 1 }}: </span>
              <span>{{ room.guestGroup.adults }} Adult </span>
              <span v-if="room.guestGroup.children_ages.length">
                / {{ room.guestGroup.children_ages.length }} Child
              </span>
            </div>

            <div class="room-item__acc">
              <div v-for="(acc, accIdx) in room.rooms" :key="accIdx">{{ acc.name }}</div>
            </div>

            <div class="room-item__meals">
              <div v-for="(meal, mealIdx) in room.meals" :key="mealIdx">{{ meal.code }}</div>
            </div>

            <div class="room-item__price" :class="[['room-item__price-color-' + room.quotaType]]">
              {{ room.price }} {{ currencies[room.currency] }}
            </div>

            <div class="room-item__info">
              <div>270€ until 30.06.2024</div>
              <div>300€ until 15.07.2024</div>
            </div>
          </li>
        </ul>

        <div class="searched-items__info">
          <AppIcon name="info" size="30px" color="#319AE6" />
        </div>

        <div class="searched-items__more-price">
          <div class="searched-items__price">
            <div>{{ calcFullHotelPrice(item.rates) }}</div>
            <AppIcon name="basket" size="20px" color="white" />
          </div>

          <div class="searched-items__more">
            <button @click="loadMoreVariants(item.hotel_id)">
              <span>More variants</span>
              <AppIcon name="angle" color="#ff7715" size="18px" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room-item {
  display: flex;
  align-items: center;
  gap: 20px;

  &__room {
    min-width: 250px;
    max-width: 250px;
  }

  &__acc {
    min-width: 235px;
    max-width: 235px;
  }

  &__meals {
    min-width: 65px;
    max-width: 65px;
  }

  &__price {
    text-align: center;
    padding: 6px;
    border-radius: 8px;
    font-weight: 600;
    min-width: 100px;
    max-width: 100px;
  }

  &__price-color-1 {
    background-color: #ccffcc;
  }

  &__price-color-2 {
    background-color: #ffcccc;
  }

  &__price-color-0 {
    background-color: #ffffcc;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
  }
}

.searched-items {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__block {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 12px;
  }

  &__name {
    color: #ff7715;
    font-size: 20px;
    font-weight: 600;
  }

  &__body {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 30px;
  }

  &__rooms {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__info {
    cursor: pointer;
    height: 30px;
  }

  &__more-price {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  &__more {
    button {
      white-space: nowrap;
      display: flex;
      gap: 4px;
      align-items: center;
      border-radius: 8px;
      padding: 6px 10px;
      color: #ff7715;
      font-weight: 700;
    }
  }

  &__price {
    cursor: pointer;
    display: flex;
    color: white;
    font-weight: 700;
    background-color: #ff7715;
    padding: 8px;
    gap: 12px;
    border-radius: 8px;
    min-width: 120px;
    justify-content: space-evenly;
  }
}
</style>
