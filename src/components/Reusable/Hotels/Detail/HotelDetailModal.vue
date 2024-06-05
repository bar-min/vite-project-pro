<script setup>
import HotlDetailGallery from '@/components/Reusable/Hotels/Detail/HotelDetailGallery.vue'
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

const emit = defineEmits(['close'])

const gallerySlides = computed(() => {
  if (!props.data) return []
  return props.data.images.map((el) => el.url)
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
      <div class="hotel-modal__content">
        <HotlDetailGallery :slides="gallerySlides" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
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
    max-width: 690px;
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
}
</style>
