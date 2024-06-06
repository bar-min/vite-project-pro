<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  coords: {
    type: Object,
    default: () => {}
  },
  height: {
    type: String,
    default: '350px'
  },
  mapNumber: {
    type: String,
    default: '1'
  }
})

const leaflet = ref(null)
const map = ref(null)

onMounted(() => {
  if (!props.coords) return
  const { lat, lon } = props.coords
  leaflet.value = window.L

  map.value = leaflet.value.map(`map-${props.mapNumber}`).setView([lat, lon], 13)
  const layer = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  leaflet.value.tileLayer(layer, { maxZoom: 19 }).addTo(map.value)
  leaflet.value.marker([lat, lon]).addTo(map.value)
})
</script>

<template>
  <div :id="`map-${mapNumber}`" class="hotel-modal-map"></div>
</template>

<style lang="scss" scoped>
.hotel-modal-map {
  width: 100%;
  height: v-bind(height);
}
</style>
