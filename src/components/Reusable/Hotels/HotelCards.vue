<script setup>
import { ref } from 'vue'
import HotelsAndRoomsSorting from './HotelsAndRoomsSorting.vue'
import HotelsPriceSorting from './HotelsPriceSorting.vue'
import HotelRateCard from './HotelRateCard.vue'
import { getHotelCard } from '@/common/services/hotels'
import HotelDetailModal from '@/components/Reusable/Hotels/Detail/HotelDetailModal.vue'
import { searchItemsByHotelId } from '@/common/services/filters.js'
import { useRouter } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  payload: {
    type: Object,
    default: () => {}
  },
  guestsGroupsCounter: {
    type: Object,
    default: () => {}
  }
})

const router = useRouter()
const emit = defineEmits(['load-more-variants'])

const hotelDetail = ref(null)
const showHotelDetail = ref(false)

async function setHotelCard(id) {
  try {
    const hotelCardData = await getHotelCard(id)
    const allVariants = await loadMoreVariants(id)
    const fullHotelData = props.items.find((el) => el.hotel_id === id)
    fullHotelData.allVariants = allVariants
    fullHotelData.showAllVariants = true
    fullHotelData.clickedMoreVariants = true

    hotelDetail.value = { ...hotelCardData, fullHotelData }
    showHotelDetail.value = true
  } catch (err) {
    console.error(err)
    showHotelDetail.value = false
  }
}

function closeHotelDetail() {
  hotelDetail.value = null
  showHotelDetail.value = false
}

async function loadMoreVariants(id) {
  const data = await searchItemsByHotelId(id, props.payload)

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

  return modifiedResult
}

function calcRooms(data) {
  return data.reduce((acc, item) => {
    const group = item.guestGroup
    const key = group.children_ages.length
      ? `+${group.adults}-${String(group.children_ages)}`
      : `+${group.adults}`
    const counter = props.guestsGroupsCounter[key]
    acc[key] ??= []

    for (let num in counter) {
      acc[key].push({ ...item })
    }

    return acc
  }, {})
}

function goToBasket(item) {
  const hotel_id = item.hotel_id
  const rate_id = item.rates[0].id
  const rooms = {}

  if (!item.allVariants) {
    rooms.value = item.rates.map((el) => {
      const group = el.guestGroup
      const guests = group.children_ages.length
        ? `${group.adults}-${String(group.children_ages)}`
        : `${group.adults}`
      return `${el.rooms[0].id}-${guests}`
    })
  } else {
    rooms.value = item.allVariants.map((el) => {
      const group = el.guestGroup
      const guests = group.children_ages.length
        ? `${group.adults}-${String(group.children_ages)}`
        : `${group.adults}`
      return `${el.allVariantsPrice.roomId}-${guests}`
    })
  }

  const routeData = router.resolve({
    name: 'Basket',
    query: { hotel_id, rate_id, rooms: rooms.value }
  })

  window.open(routeData.href, '_blank')
}
</script>

<template>
  <div class="hotel-cards">
    <div class="hotel-cards__sorting" v-show="items.length">
      <HotelsAndRoomsSorting />
      <HotelsPriceSorting />
    </div>

    <HotelRateCard
      v-for="(item, idx) in items"
      :key="idx"
      :item="item"
      @set-hotel-card="setHotelCard"
      @load-more-variants="({ hotel_id }) => emit('load-more-variants', { hotel_id })"
      @go-to-basket="goToBasket"
    />

    <HotelDetailModal
      :data="hotelDetail"
      :show="showHotelDetail"
      @close="closeHotelDetail"
      @go-to-basket="goToBasket"
    />
  </div>
</template>

<style lang="scss" scoped>
.hotel-cards {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__sorting {
    display: flex;
    gap: 30px;
  }
}
</style>
