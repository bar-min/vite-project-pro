<script setup>
import AppIcon from '@/components/Reusable/AppIcon.vue'
import AppRadiobutton from '../../Fields/AppRadiobutton.vue'
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  dates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['load-more-variants', 'set-hotel-card'])

const currencies = {
  EUR: '€',
  ЛВ: 'ЛВ'
}

const getDiffDays = computed(() => {
  if (!props.dates || props.dates?.length < 2) return
  const timeDiff = Math.abs(props.dates[1].getTime() - props.dates[0].getTime())
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return `(${diffDays + 1} days/${diffDays} nights)`
})

function calcFullHotelPrice(rates) {
  const currency = rates[0].currency
  const price = rates.reduce((acc, el) => parseFloat((acc + el.price).toFixed(2)), 0)
  return `${price} ${currencies[currency]}`
}

function calcAllVariantsPrice(variants) {
  const currency = Object.values(variants)[0].items[0].currency
  const price = Object.values(variants).reduce((acc, el) => {
    const { price } = el.allVariantsPrice
    return parseFloat((acc + price).toFixed(2))
  }, 0)

  return `${price} ${currencies[currency]}`
}

function calcBruttoDetail(brutto, price) {
  const bruttoPrice = parseFloat(brutto.split('=').at(-1))
  const diffPrice = parseFloat((price - bruttoPrice).toFixed(2))
  const fullString = `${brutto} + ${diffPrice} (Adhots costs) = ${price} `
  return fullString
}

function calcQuotaType(item) {
  if (!item.showAllVariants) {
    return item.rates.some((el) => el.quotaType === 2)
  } else {
    return item.allVariants.some((el) => {
      const current = el.items.find((item) => item.id + item.rooms[0].id === el.allVariantsPrice.id)
      return current.quotaType === 2
    })
  }
}
</script>

<template>
  <div class="hotel-rate">
    <div class="hotel-rate__body">
      <ul class="hotel-rate__rooms" v-if="!item.showAllVariants || !item.allVariants">
        <li class="hotel-rate__room room-item" v-for="(room, roomIdx) in item.rates" :key="roomIdx">
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

          <div class="room-item__price-wrap">
            <div class="room-item__price" :class="[['room-item__price-color-' + room.quotaType]]">
              {{ room.price }} {{ currencies[room.currency] }}
            </div>

            <div class="room-item__price-calc">
              {{ calcBruttoDetail(room.bruttoDetail, room.price) }}
            </div>
          </div>

          <div class="room-item__info">
            <div>270€ until 30.06.2024</div>
            <div>300€ until 15.07.2024</div>
          </div>

          <div class="room-item__space"></div>
        </li>
      </ul>

      <ul class="hotel-rate__variants" v-if="item.showAllVariants && item.allVariants">
        <li
          class="hotel-rate__variant variant-item"
          v-for="(hotel, idx) in item.allVariants"
          :key="idx"
        >
          <div class="variant-item__room">
            <span>Room {{ idx + 1 }}: </span>
            <span>{{ hotel.guestGroup.adults }} Adult </span>
            <span v-if="hotel.guestGroup.children_ages.length">
              / {{ hotel.guestGroup.children_ages.length }} Child
            </span>
          </div>

          <ul class="hotel-rate__rooms">
            <li
              class="hotel-rate__room room-item"
              v-for="(room, roomIdx) in hotel.items"
              :key="roomIdx"
            >
              <div class="room-item__acc">
                <div v-for="(acc, accIdx) in room.rooms" :key="accIdx">{{ acc.name }}</div>
              </div>

              <div class="room-item__meals">
                <div v-for="(meal, mealIdx) in room.meals" :key="mealIdx">{{ meal.code }}</div>
              </div>

              <div class="room-item__price-wrap">
                <div
                  class="room-item__price"
                  :class="[['room-item__price-color-' + room.quotaType]]"
                >
                  {{ room.price }} {{ currencies[room.currency] }}
                </div>
                <div class="room-item__price-calc">
                  {{ calcBruttoDetail(room.bruttoDetail, room.price) }}
                </div>
              </div>

              <div class="room-item__info">
                <div>270€ until 30.06.2024</div>
                <div>300€ until 15.07.2024</div>
              </div>

              <div v-if="hotel.items.length > 1">
                <AppRadiobutton
                  v-model="hotel.allVariantsPrice"
                  :value="{
                    idx: roomIdx,
                    id: room.id + room.rooms[0].id,
                    price: room.price,
                    currency: room.currency
                  }"
                />
              </div>

              <div v-else class="room-item__space"></div>
            </li>
          </ul>
        </li>
      </ul>

      <div class="hotel-rate__info">
        <AppIcon name="info" size="30px" color="#319AE6" />
      </div>

      <div class="hotel-rate__more-price">
        <div class="hotel-rate__price" :class="{ 'price-disabled': calcQuotaType(item) }">
          <div>
            {{
              item.showAllVariants && item.allVariants
                ? calcAllVariantsPrice(item.allVariants)
                : calcFullHotelPrice(item.rates)
            }}
          </div>
          <AppIcon name="basket" size="20px" color="white" />
        </div>

        <div class="hotel-rate__more" v-show="!item.showAllVariants || !item.clickedMoreVariants">
          <button @click="emit('load-more-variants', { hotel_id: item.hotel_id })">
            <span>More variants</span>
            <AppIcon name="angle" color="#ff7715" size="18px" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.variant-item {
  display: flex;
  align-items: center;
  gap: 20px;

  &__room {
    min-width: 220px;
    max-width: 220px;
  }

  &:not(:last-child) {
    padding-bottom: 14px;
    border-bottom: 1px dotted rgb(128, 128, 128, 0.5);
  }
}
.room-item {
  display: flex;
  align-items: center;
  gap: 20px;

  &__room {
    min-width: 220px;
    max-width: 220px;
  }

  &__acc {
    min-width: 235px;
    max-width: 235px;
  }

  &__meals {
    min-width: 65px;
    max-width: 65px;
  }

  &__price-wrap {
    position: relative;
  }

  &__price {
    cursor: pointer;
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

  &__price-calc {
    display: none;
    position: absolute;
    bottom: calc(100% + 5px);
    width: max-content;
    max-width: 500px;
    text-align: left;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 8px;
    border-radius: 8px;
    background: white;
    z-index: 1000;
  }

  &__price:hover ~ &__price-calc {
    display: block;
  }

  &__price-calc:hover {
    display: block;
  }

  &__info {
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }

  &__space {
    width: 23px;
  }
}

.hotel-rate {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 12px;

  &__sorting {
    display: flex;
    gap: 30px;
  }

  &__name {
    cursor: pointer;
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
    gap: 8px;
  }

  &__variants {
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

  .price-disabled {
    background-color: hsla(0, 0%, 11%, 0.4);
  }

  &__more {
    button {
      white-space: nowrap;
      display: flex;
      gap: 4px;
      align-items: center;
      border-radius: 8px;
      padding: 6px 0;
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
