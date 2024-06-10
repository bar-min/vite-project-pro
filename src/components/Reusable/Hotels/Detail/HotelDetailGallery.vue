<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import { ref, onMounted } from 'vue'

defineProps({
  slides: {
    type: Array,
    default: () => []
  }
})

const main = ref()
const thumbs = ref()

const mainOptions = {
  type: 'fade',
  gap: '1rem',
  perPage: 1,
  perMove: 1,
  pagination: false,
  lazyLoad: 'nearby'
}

const thumbsOptions = {
  type: 'slide',
  rewind: true,
  gap: '0.5rem',
  focus: 'center',
  pagination: false,
  arrows: false,
  fixedWidth: 160,
  fixedHeight: 100,
  cover: true,
  isNavigation: true,
  updateOnMove: true,
  lazyLoad: 'nearby',
  preloadPages: 6
}

onMounted(() => {
  const thumbsSplide = thumbs.value?.splide

  if (thumbsSplide) {
    main.value?.sync(thumbsSplide)
  }
})
</script>

<template>
  <div class="wrapper" v-show="slides.length">
    <Splide class="main-splide" :options="mainOptions" ref="main">
      <SplideSlide v-for="(slide, idx) in slides" :key="idx">
        <img class="splide-image" :data-splide-lazy="slide" />
      </SplideSlide>
    </Splide>

    <Splide class="thumbs-splide" :options="thumbsOptions" ref="thumbs">
      <SplideSlide v-for="(slide, idx) in slides" :key="idx">
        <img :data-splide-lazy="slide" />
      </SplideSlide>
    </Splide>
  </div>
</template>

<style lang="scss">
.splide-image {
  height: 500px;
  width: 100%;
  object-fit: cover;
}

.main-splide {
  min-height: 500px;
  margin-bottom: 12px;
}

.thumbs-splide {
  .splide__slide {
    opacity: 0.6;
  }

  .splide__slide.is-active {
    opacity: 1;
    border: none !important;
  }
}
</style>
