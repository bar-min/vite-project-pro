<script setup>
import HotlDetailGallery from '@/components/Reusable/Hotels/Detail/HotelDetailGallery.vue'
import HotelDetailMap from './HotelDetailMap.vue'
import HoteDetailRateCard from './HoteDetailRateCard.vue'
import { watch, computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'go-to-basket'])

const gallerySlides = computed(() => {
  if (!props.data.images) return []
  return props.data.images.map((el) => el.url)
})

const coords = computed(() => {
  if (!props.data) return
  const { latitude, longitude } = props.data.geo_coordinates
  return { lat: latitude, lon: longitude }
})

watch(
  () => props.show,
  (value) => {
    if (value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="hotel-modal">
    <div class="bg-effect" v-show="show" @click="emit('close')"></div>

    <div class="hotel-modal__wrapper" :class="{ show: show }">
      <div class="hotel-modal__content" v-if="data">
        <h2 class="hotel-modal__title">{{ data.fullHotelData.hotel_name }}</h2>

        <HotlDetailGallery class="hotel-modal__gallery" :slides="gallerySlides" />

        <div class="hotel-modal__info">
          <div></div>
          <HotelDetailMap
            class="hotel-modal__short-map"
            :coords="coords"
            height="350px"
            map-number="1"
          />
        </div>

        <HoteDetailRateCard
          :item="data.fullHotelData"
          @go-to-basket="(value) => emit('go-to-basket', value)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.hotel-modal-short-map {
  width: 100%;
  height: 350px;
}

.hotel-modal-map {
  width: 100%;
  height: 350px;
}

.bg-effect {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.hotel-modal {
  &__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    transform: translateX(100%);
    transition: all 0.4s;
    z-index: 100;
    max-width: 1200px;

    &.show {
      transform: translateX(0);
    }
  }

  &__content {
    padding: 30px;
    min-width: 650px;
    height: 100%;
    overflow-y: auto;
  }

  &__title {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 30px;
    color: #ff7715;
  }

  &__gallery {
    margin-bottom: 40px;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  &__short-map {
    flex-basis: 50%;
    height: 250px;
  }

  &__full-map {
    margin-bottom: 40px;
  }
}
</style>
